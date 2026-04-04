import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('BoardsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let userToken: string;
  let adminToken: string;

  let createdBoardId: number;

  const userEmail = 'user@test.com';
  const adminEmail = 'admin@test.com';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(cookieParser());

    await app.init();

    prisma = moduleRef.get(PrismaService);

    // ---------- REGISTER ----------

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: userEmail,
        password: '123456',
        name: 'User',
      });

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: adminEmail,
        password: '123456',
        name: 'Admin',
      });

    // ---------- SET ADMIN ROLE ----------

    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'ADMIN' },
    });

    // ---------- LOGIN USER ----------

    const userRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userEmail,
        password: '123456',
      });

    userToken = userRes.body.accessToken;

    // ---------- LOGIN ADMIN ----------

    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: adminEmail,
        password: '123456',
      });

    adminToken = adminRes.body.accessToken;
  

  afterAll(async () => {
    await prisma.board.deleteMany({
      where: {
        title: { in: ['Тестовая доска'] },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: { in: [userEmail, adminEmail] },
      },
    });

    await app.close();
  });
 
});

describe('GET /boards', () => {

  it('should return 401 without token', async () => {
    // Arrange

    // Act
    const res = await request(app.getHttpServer())
      .get('/boards');

    // Assert
    expect(res.status).toBe(401);
  });

  it('should return 200 with USER token', async () => {
    // Arrange

    // Act
    const res = await request(app.getHttpServer())
      .get('/boards')
      .set('Authorization', `Bearer ${userToken}`);

    // Assert
    expect(res.status).toBe(200);
  });

});

describe('POST /boards', () => {

  it('should return 403 when USER tries to create board', async () => {
    // Arrange

    // Act
    const res = await request(app.getHttpServer())
      .post('/boards')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Тестовая доска',
      });

    // Assert
    expect(res.status).toBe(403);
  });

  it('should create board when ADMIN', async () => {
    // Arrange

    // Act
    const res = await request(app.getHttpServer())
      .post('/boards')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Тестовая доска',
      });

    // Assert
    expect(res.status).toBe(201);

    // сохраняем ID — ОЧЕНЬ ВАЖНО
    createdBoardId = res.body.id;
  });

});

describe('TASKS', () => {
  let taskId: number;

  it('should create task without userId in body', async () => {
    // Arrange

    // Act
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Моя задача',
        boardId: createdBoardId,
        // userId НЕ передаем
      });

    // Assert
    expect(res.status).toBe(201);
    expect(res.body.userId).toBeDefined();

    taskId = res.body.id;
  });

  it('should update own task', async () => {
    // Arrange

    // Act
    const res = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Обновленная задача',
      });

    // Assert
    expect(res.status).toBe(200);
  });

  it('should NOT update чужую задачу', async () => {
    // Arrange

    // Act
    const res = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`) // не владелец (если логика такая)
      .send({
        title: 'Попытка взлома',
      });

    // Assert
    expect(res.status).toBe(403);
  });

  it('should allow ADMIN to delete чужую задачу', async () => {
    // Arrange

    // Act
    const res = await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    // Assert
    expect(res.status).toBe(200);
  });

});

});