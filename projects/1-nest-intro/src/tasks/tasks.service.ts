import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entity/task.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLabel } from './entity/task-label.entity';
import { DataSource, FindOptionsWhere, Like } from 'typeorm';
import { sanitizePatch } from '../utils/helper';
import { CreateTaskLabelDto } from './dto/create-task-label.dto';
import { In } from 'typeorm';
import { FindTaskParams } from './dto/find-task.params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private taskLabelRepository: Repository<TaskLabel>,
    private dataSource: DataSource,
  ) {}

  public async findAll(filters: FindTaskParams): Promise<[Task[], number]> {
    console.log(filters);

    // using array to construct OR query
    const where: FindOptionsWhere<Task>[] = [];
    if (filters.status) {
      where.push({ status: filters.status });
    }
    if (filters.title?.trim()) {
      where.push({ title: Like(`%${filters.title}%`) });
    }
    if (filters.desc?.trim()) {
      where.push({ desc: Like(`%${filters.desc}%`) });
    }

    return this.taskRepository.findAndCount({
      where,
      relations: ['labels'],
      skip: filters.offset,
      take: filters.limit,
    });
  }

  public async findWithQueryBuilder(
    filters: FindTaskParams,
  ): Promise<[Task[], number]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.labels', 'labels');

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.title?.trim()) {
      query.andWhere('(task.title ILIKE :title', {
        title: `%${filters.title}%`,
      });
    }

    if (filters.desc?.trim()) {
      query.andWhere('(task.desc ILIKE :desc)', { desc: `%${filters.desc}%` });
    }

    if (filters?.labels.length) {
      query.andWhere('labels.name IN (:...labelNames)', {
        labelNames: filters.labels,
      });
    }

    query.orderBy(`task.${filters.sortBy}`, filters.sortOrder);
    query.skip(filters.offset).take(filters.limit);
    return query.getManyAndCount();
  }

  public async findOne(id: string): Promise<Task> {
    return this.findOneOrFail(id);
  }
  public async findOneWithLabels(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['labels'],
    });
    if (!task) {
      throw new NotFoundException('Task not found!');
    }
    return task;
  }

  public async createTask(task: CreateTaskDto, userId: string): Promise<Task> {
    return await this.taskRepository.save({ ...task, userId });
  }

  public async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.findOneOrFail(id);
    task.status = status;
    return this.taskRepository.save(task);
  }

  public async updateTask(
    id: string,
    updatedTask: UpdateTaskDto,
  ): Promise<Task> {
    // Find task within transaction for strictest locking if needed
    return await this.dataSource.transaction(async (manager) => {
      const taskRepository = manager.getRepository(Task);
      const taskLabelRepository = manager.getRepository(TaskLabel);

      const task = await taskRepository.findOneOrFail({
        where: { id },
        relations: ['labels'],
      });

      // Validate status change if provided
      if (
        updatedTask.status &&
        !this.isValidStatusTransition(task.status, updatedTask.status)
      ) {
        throw new BadRequestException('Invalid status!');
      }

      // Only update properties that are in updatedTask
      Object.assign(task, sanitizePatch(updatedTask));

      // Handle label updates only if updatedTask.labels is present:
      if ('labels' in updatedTask) {
        // Delete existing labels for this task
        await taskLabelRepository.delete({ taskId: id });

        if (updatedTask.labels && updatedTask.labels.length > 0) {
          const newLabels = updatedTask.labels.map((dto) =>
            // taskLabelRepository.create({ ...dto, task }),
            // both will work
            taskLabelRepository.create({ ...dto, taskId: task.id }),
          );
          await taskLabelRepository.save(newLabels);
          task.labels = newLabels; // keep entity in sync
        } else {
          task.labels = [];
        }
      }

      // Save task (do not spread, just update properties on the entity)
      const savedTask = await taskRepository.save(task);
      return savedTask;
    });
  }

  public async deleteOne(id: string): Promise<void> {
    await this.findOneOrFail(id);
    await this.taskRepository.delete({ id });
  }

  public async addLabels(
    task: Task,
    labelsDto: CreateTaskLabelDto[],
  ): Promise<Task> {
    // 1. combine existing labels with newly added labels
    const newLabels = this.prepareLabels(task.id, task.labels, labelsDto);
    // 2. update labels property of task;
    task.labels = newLabels;
    console.log({ task });

    console.log(task.labels);
    return this.taskRepository.save(task);
  }

  private prepareLabels(
    taskId: string,
    existingLabels: TaskLabel[],
    taskLabelDtos: CreateTaskLabelDto[],
  ): TaskLabel[] {
    // 1. filter the duplicated label names
    const uniqueNewLabelNames = [
      ...new Set(taskLabelDtos.map((label) => label.name)),
    ];
    // 2. get all the existing label names;
    const existingLabelNames = new Set(
      existingLabels.map((label) => label.name),
    );
    // 3. filter the no-existing label names, and create TaskLabel entities
    const filteredLabels = uniqueNewLabelNames
      .filter((name) => !existingLabelNames.has(name))
      .map((name) =>
        this.taskLabelRepository.create({
          name,
          taskId, // it's better to add it explicitly
        }),
      );

    // 4. merge new labels and existing label
    return filteredLabels;
  }

  // this new method don't rely on cascade operation for upserting;
  // since that's hard to maintain
  public async addLabelsNew(
    task: Task,
    labelDtos: CreateTaskLabelDto[],
  ): Promise<Task> {
    // deduplicate label name.
    const newLabelDtos = this.prepareLabels(task.id, task.labels, labelDtos);

    // add labes using labe repository
    if (newLabelDtos.length > 0) {
      await this.taskLabelRepository.insert(
        newLabelDtos.map((dto) => ({
          name: dto.name,
          taskId: task.id,
        })),
      );
    }

    return this.findOneWithLabels(task.id);
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];

    return (
      // no allow use the front status
      statusOrder.indexOf(currentStatus) < statusOrder.indexOf(newStatus) &&
      // no allow to jump to the one after next status
      statusOrder.indexOf(newStatus) === statusOrder.indexOf(currentStatus) + 1
    );
  }

  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      // exception is also business logic, it's recommended to throw it here, instead of return undefine;
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  // Totally wrong, it want to delete label based on the relation operation from Task, but it need the label ids which will be deleted, but it don't provide them.
  /*
  public async deleteLabels(taskId: string, paramLabels: CreateTaskLabelDto[]) {
    const uniqueName =paramLabels.map((label) => label.name);
    const task = await this.findOneWithLabels(taskId);
    task.labels = task.labels.filter((label) => !uniqueName.has(label.name));
    console.log('task labels: ', task.labels);
    return this.taskRepository.save(task);
  }
  */

  public async deleteLabels(
    taskId: string,
    paramLabels: CreateTaskLabelDto[],
  ): Promise<Task> {
    // get the names waiting for deletion.
    const labelNames = paramLabels.map((label) => label.name);

    await this.taskLabelRepository.delete({
      taskId,
      name: In(labelNames),
    });

    // query the task again
    return this.findOneWithLabels(taskId);
  }
}
