import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import request from 'supertest';
import { App } from 'supertest/types';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BooksModule } from '../src/books/books.module';

jest.setTimeout(120000);

describe('Books CRUD with MongoDB (e2e)', () => {
  let app: INestApplication<App>;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const module = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongo.getUri()), BooksModule],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
    if (mongo) await mongo.stop();
  });

  it('creates, reads, updates and deletes a persisted book', async () => {
    await request(app.getHttpServer()).get('/books').expect(200).expect([]);
    const created = await request(app.getHttpServer())
      .post('/books')
      .send({ title: 'Test book', authors: 'Author' })
      .expect(201);
    const book = created.body as {
      _id: string;
      title: string;
      favorite: boolean;
    };
    expect(book._id).toMatch(/^[a-f0-9]{24}$/);
    expect(book.favorite).toBe(false);
    const list = await request(app.getHttpServer()).get('/books').expect(200);
    expect(list.body).toEqual([expect.objectContaining({ _id: book._id })]);
    await request(app.getHttpServer())
      .get('/books/' + book._id)
      .expect(200)
      .expect(created.body);
    const updated = await request(app.getHttpServer())
      .put('/books/' + book._id)
      .send({ title: 'Updated', favorite: true })
      .expect(200);
    expect(updated.body).toEqual(
      expect.objectContaining({
        title: 'Updated',
        authors: 'Author',
        favorite: true,
      }),
    );
    const saved = await request(app.getHttpServer())
      .get('/books/' + book._id)
      .expect(200);
    expect(saved.body).toEqual(
      expect.objectContaining({ title: 'Updated', favorite: true }),
    );
    await request(app.getHttpServer())
      .delete('/books/' + book._id)
      .expect(200);
    await request(app.getHttpServer())
      .get('/books/' + book._id)
      .expect(404);
    await request(app.getHttpServer()).get('/books').expect(200).expect([]);
  });

  it('rejects invalid bodies and IDs', async () => {
    await request(app.getHttpServer()).post('/books').send({}).expect(400);
    await request(app.getHttpServer())
      .post('/books')
      .send({ title: '  ' })
      .expect(400);
    await request(app.getHttpServer())
      .post('/books')
      .send({ title: 'Book', favorite: 'yes' })
      .expect(400);
    await request(app.getHttpServer())
      .post('/books')
      .send({ title: 'Book', unknown: 1 })
      .expect(400);
    for (const method of ['get', 'put', 'delete'] as const) {
      await request(app.getHttpServer())
        [method]('/books/invalid')
        .send({})
        .expect(400);
      await request(app.getHttpServer())
        [method]('/books/000000000000000000000001')
        .send({})
        .expect(404);
    }
    await request(app.getHttpServer()).get('/books').expect(200).expect([]);
  });
});
