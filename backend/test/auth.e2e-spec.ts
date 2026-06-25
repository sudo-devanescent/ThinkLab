import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) debe rechazar email vacío', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: '', password: '123456', fullName: 'Test' })
      .expect(400);
  });

  it('/auth/login (POST) debe rechazar credenciales inválidas', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'noexiste@test.com', password: 'wrong' })
      .expect(401);
  });
});
