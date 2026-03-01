import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  create(data: { name: string; email: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  // READ ALL
  findAll() {
    return this.prisma.user.findMany({
      include: {
        tasks: true,
      },
    });
  }

  // READ ONE
  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });
  }

  // UPDATE
  update(id: number, data: { name?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // DELETE
  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
