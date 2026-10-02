import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/books (GET) returns the books stored by the service', async () => {
    const response = await request(app.getHttpServer())
      .get('/books')
      .expect(200);
    expect(response.body).toEqual([
      expect.objectContaining({ id: 1, title: 'Мастер и Маргарита' }),
      expect.objectContaining({ id: 2, title: 'Евгений Онегин' }),
    ]);
  });

  it('/books/1 (GET) returns a book by ID', async () => {
    const response = await request(app.getHttpServer())
      .get('/books/1')
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({ id: 1, authors: 'Михаил Булгаков' }),
    );
  });

  it('/books/999 (GET) returns 404 for a missing book', () => {
    return request(app.getHttpServer()).get('/books/999').expect(404);
  });

  it('/books/invalid (GET) returns 400 for an invalid ID', () => {
    return request(app.getHttpServer()).get('/books/invalid').expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
