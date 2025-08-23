import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { storage } from './storage/my-file-storage';
import * as fs from 'fs';
import * as path from 'path';
import { WINSTON_LOGGER_TOKEN } from './winston/winston.module';
import { NewLogger } from './winston/new.logger';

@Controller()
export class AppController {
  @Inject(WINSTON_LOGGER_TOKEN)
  private logger: NewLogger;

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.log('winstom logging....', AppController.name);
    return this.appService.getHello();
  }

  @Post('aaa')
  @UseInterceptors(
    FileInterceptor('aaa', {
      dest: 'uploads',
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log('body', body);
    console.log('file', file);
  }

  @Post('bbb')
  @UseInterceptors(
    FilesInterceptor('bbb', 2, {
      dest: 'uploads',
    }),
  )
  uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    console.log('body', body);
    console.log('files', files);
  }

  @Post('ccc')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'aaa', maxCount: 2 },
        { name: 'bbb', maxCount: 2 },
      ],
      {
        dest: 'uploads',
      },
    ),
  )
  uploadFileFields(
    @UploadedFiles()
    files: { aaa?: Express.Multer.File[]; bbb?: Express.Multer.File[] },
    @Body() body,
  ) {
    console.log('body', body);
    console.log('files', files);
  }

  // 分片上传
  @Post('ddd')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: 'uploads',
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 200,
      },
    }),
  )
  uploadSliceFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { name: string },
  ) {
    console.log('body', body);
    console.log('files', files);

    // ✅ 检查并获取第一个文件
    const firstFile = files?.[0];
    if (!firstFile) {
      throw new Error('没有上传文件');
    }

    // ✅ 正则匹配检查
    const match = body.name.match(/(.+)-\d+$/);
    if (!match) {
      throw new Error('文件名格式错误');
    }

    const fileName = match[1];
    const chunkDir = 'uploads/chunks_' + fileName;

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }

    fs.copyFileSync(firstFile.path, chunkDir + '/' + body.name);
    fs.unlinkSync(firstFile.path);
  }

  // 合并所有上传的文件分片

  @Get('merge')
  async mergeSlices(@Query('name') name: string) {
    try {
      console.log('start merging all slices');

      const chunkDir = path.join('uploads', `chunks_${name}`);
      const targetFile = path.join('uploads', name);

      // ✅ 1. 获取并排序分片文件(解决可能的文件顺序混乱问题)
      const files = fs.readdirSync(chunkDir).sort((a, b) => {
        const aIndex = parseInt(a.match(/-(\d+)$/)?.[1] || '0');
        const bIndex = parseInt(b.match(/-(\d+)$/)?.[1] || '0');
        return aIndex - bIndex;
      });

      console.log('分片文件顺序:', files);

      // ✅ 2. 创建目标文件的写入流
      // 原代码: files.map() 同时启动所有分片的写入操作
      // 问题: 多个 WriteStream 同时写入同一文件的不同位置，可能造成文件损坏
      // 解决: 创建单一的写入流，顺序处理每个分片
      const writeStream = fs.createWriteStream(targetFile);

      // ✅ 3. 顺序合并每个分片
      // 🚫➡️✅ 解决问题3: 异步操作的位置计算错误
      // 原代码: 在 map 循环中同步计算 startPos，但写入是异步的
      // 问题: startPos 在所有异步操作开始前就被计算完，导致位置错乱
      // 解决: 使用 for...of 循环确保顺序处理，无需手动计算位置
      for (const file of files) {
        const filePath = path.join(chunkDir, file);
        // 🚫➡️✅ 解决问题4: 缺少错误处理
        // 原代码: 只有 .on('finish') 没有 .on('error')
        // 问题: 如果读取或写入失败，无法知道和处理
        // 解决: 在 appendChunkToStream 中添加完整的错误处理
        await this.appendChunkToStream(filePath, writeStream);
        console.log(`分片 ${file} 合并完成`);
      }

      // ✅ 4. 关闭写入流
      // 🚫➡️✅ 解决问题5: 写入流未正确关闭
      // 原代码: 没有显式关闭写入流
      // 问题: 可能导致数据未完全刷新到磁盘
      // 解决: 明确调用 end() 关闭流
      writeStream.end();

      // ✅ 5. 清理临时目录
      // 🚫➡️✅ 解决问题6: 异步清理操作的时机问题
      // 原代码: 在 count === files.length 时立即清理，但可能还有数据在写入
      // 问题: 可能在文件完全写入前就删除了临时目录
      // 解决: 确保所有操作完成后再清理
      await fs.promises.rm(chunkDir, { recursive: true });

      console.log('所有分片合并完成');
      return { success: true, message: '文件合并成功', filePath: targetFile };
    } catch (error) {
      // 🚫➡️✅ 解决问题7: 缺少统一的错误处理
      // 原代码: 没有 try-catch，错误可能导致进程崩溃
      // 解决: 添加统一错误处理和友好的错误响应
      console.error('合并失败:', error);
      throw new Error('文件合并失败');
    }
  }

  // ✅ 辅助方法：将单个分片追加到写入流
  // 🚫➡️✅ 解决问题8: 流操作的 Promise 化
  // 原代码: 使用回调方式处理流，难以控制执行顺序
  // 问题: 无法确保上一个分片完全写入后再处理下一个
  // 解决: 将流操作封装为 Promise，支持 async/await
  private appendChunkToStream(
    chunkPath: string,
    writeStream: fs.WriteStream,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(chunkPath);

      readStream.on('data', (chunk) => {
        // 将数据写入目标文件流
        writeStream.write(chunk);
      });

      readStream.on('end', () => {
        // 当前分片读取完成，可以继续下一个
        resolve();
      });

      readStream.on('error', (error) => {
        // 读取出错时拒绝 Promise
        reject(error);
      });
    });
  }
}
