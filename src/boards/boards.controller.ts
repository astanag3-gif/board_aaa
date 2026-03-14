import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateBoardDto } from './dto/create-board.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';


@ApiTags('boards')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateBoardDto) {
  return this.boardsService.create(dto);
  }

  @Get()
    findAll() {
    return this.boardsService.findAll();
  }

  @Get(':id')
    findOne(@Param('id') id: string) {
    return this.boardsService.findOne(Number(id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() body: { title?: string }) {
    return this.boardsService.update(Number(id), body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.boardsService.remove(Number(id));
  }
}