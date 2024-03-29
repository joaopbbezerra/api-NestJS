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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { ParamId } from '../decorators/param-id.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from '../guards/auth.guard';
import { LogInterceptor } from '../interceptors/log.interceptor';

//@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Roles(Role.Admin, Role.User)
  @Get()
  async readAll() {
    return this.userService.list();
  }

  @Roles(Role.Admin)
  @Get(':id')
  async readOne(@ParamId() id: number) {
    return this.userService.findOne(id);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@Body() body: UpdatePutUserDto, @ParamId() id: number) {
    //If something is undefined, it won't be updated
    return this.userService.update(body, id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async partialUpdate(@Body() body: UpdatePatchUserDto, @ParamId() id: number) {
    return this.userService.partialUpdate(body, id);
  }
  @Roles(Role.Admin)
  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
