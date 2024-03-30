import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateUserDto) {
    //We don't need the await when we are returning inside a Async function

    //Creating the hash password - Hash is a one way function.
    data.password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data,
      //Select is the columns you want them to return
      /* select: {
        id: true,
      }*/
    });
  }

  async list() {
    return this.prisma.user.findMany();

    //We can filter it like that:
    /*  this.prisma.user.findMany({
      where: {
        email: {
          contains: "@gmail.com"
        }
      }
    });*/
  }

  async findOne(id: number) {
    await this.exists(id);
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    { name, password, email, birthAt, role }: UpdatePutUserDto,
    id: number,
  ) {
    await this.exists(id);
    password = await bcrypt.hash(password, 10);
    return this.prisma.user.update({
      data: {
        name,
        password,
        email,
        birthAt: birthAt ? new Date(birthAt) : null,
        role: role ? role : 1,
      },
      where: {
        id,
      },
    });
  }

  async partialUpdate(data: UpdatePatchUserDto, id: number) {
    const updatedData: Omit<UpdatePatchUserDto, 'birthAt'> & { birthAt: Date } =
      {
        ...data,
        birthAt: null,
      };
    await this.exists(id);
    data.password = await bcrypt.hash(data.password, 10);

    return this.prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    if (await this.findOne(id)) {
      return this.prisma.user.delete({
        where: {
          id,
        },
      });
    }
    throw new NotFoundException('User does not exist');
  }

  async exists(id: number) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException('User does not exist');
    }
  }
}
