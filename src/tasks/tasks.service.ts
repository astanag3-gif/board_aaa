import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  create(data: {
    title: string;
    description?: string;
    status?: 'todo' | 'in_progress' | 'done';
    boardId: number;
    userId: number;
  }) {
    return this.prisma.task.create({
      data,
    });
  }

  // READ ALL
  findAll() {
    return this.prisma.task.findMany({
      include: {
        board: true,
        user: true,
      },
    });
  }

  // READ ONE
  findOne(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        board: true,
        user: true,
      },
    });
  }

  // UPDATE
  update(
    id: number,
    data: {
      title?: string;
      description?: string;
      status?: 'todo' | 'in_progress' | 'done';
    },
  ) {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  // DELETE
  remove(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}