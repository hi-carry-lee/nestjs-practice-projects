import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';
import { UpdateAaaDto } from './dto/update-aaa.dto';
import { LoginGuard } from 'src/guards/login.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { PermissionNewGuard } from 'src/guards/permissionNew.guard';
import { PermissionRedisGuard } from 'src/guards/permissionRedis.guard';

@Controller('aaa')
export class AaaController {
  constructor(private readonly aaaService: AaaService) {}

  @Post()
  @UseGuards(LoginGuard)
  create(@Body() createAaaDto: CreateAaaDto) {
    return this.aaaService.create(createAaaDto);
  }

  @Get('redis-permission')
  @UseGuards(LoginGuard, PermissionRedisGuard)
  @SetMetadata('permission', 'query_aaa')
  findWithRedisPermission() {
    return 'use redis to store user permissions';
  }

  @Get()
  @UseGuards(LoginGuard, PermissionGuard)
  @SetMetadata('permission', 'query_aaa')
  findAll() {
    return this.aaaService.findAll();
  }

  @Get(':id')
  @UseGuards(LoginGuard, PermissionNewGuard)
  @SetMetadata('permission', 'query_aaa')
  findOne(@Param('id') id: string) {
    return this.aaaService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(LoginGuard)
  update(@Param('id') id: string, @Body() updateAaaDto: UpdateAaaDto) {
    return this.aaaService.update(+id, updateAaaDto);
  }

  @Delete(':id')
  @UseGuards(LoginGuard)
  remove(@Param('id') id: string) {
    return this.aaaService.remove(+id);
  }
}
