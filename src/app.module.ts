import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BoardsModule } from './boards/boards.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [PrismaModule, BoardsModule, UsersModule, TasksModule, AuthModule,ConfigModule.forRoot({ isGlobal: true })],  
  controllers: [AppController],
  providers: [AppService],
  })
export class AppModule {}
