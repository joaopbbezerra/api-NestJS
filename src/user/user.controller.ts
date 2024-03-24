import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() body: CreateUserDto) {
    return { body };
  }

  @Get()
  async readAll() {
    return {
      users: [],
    };
  }

  @Get(':id')
  async readOne(@Param('id', ParseIntPipe) id: number) {
    return {
      user: {},
      id,
    };
  }

  @Put(':id')
  async update(
    @Body() body: UpdatePutUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      method: 'Put',
      body,
      id,
    };
  }

  @Patch(':id')
  async partialUpdate(
    @Body() body: UpdatePatchUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      method: 'Patch',
      body,
      id,
    };
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return {
      method: 'Delete',
      id,
    };
  }
}
