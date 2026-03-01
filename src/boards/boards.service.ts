import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  create(data: { title: string }) {
    return this.prisma.board.create({
      data,
    });
  }

  // READ ALL
  findAll() {
    return this.prisma.board.findMany({
      include: {
        tasks: true,
      },
    });
  }

  // READ ONE
  findOne(id: number) {
    return this.prisma.board.findUnique({
      where: { id },
      include: { tasks: true },
    });
  }

  // UPDATE
  update(id: number, data: { title?: string }) {
    return this.prisma.board.update({
      where: { id },
      data,
    });
  }

  // DELETE
  remove(id: number) {
    return this.prisma.board.delete({
      where: { id },
    });
  }
}