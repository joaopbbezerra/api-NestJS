import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() body) {
    return { body };
  }

  @Get()
  async readAll() {
    return {
      users: [],
    };
  }

  @Get(':id')
  async readOne(@Param() param) {
    return {
      user: {},
      param,
    };
  }

  @Put(':id')
  async update(@Body() body, @Param() params) {
    return {
      method: 'Put',
      body,
      params,
    };
  }

  @Patch(':id')
  async partialUpdate(@Body() body, @Param() params) {
    return {
      method: 'Patch',
      body,
      params,
    };
  }

  @Delete(':id')
  async deleteOne(@Param() param) {
    return {
      method: 'Delete',
      param,
    };
  }
}
