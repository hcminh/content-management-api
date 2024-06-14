import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ContentModule } from './content.module';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './content.entity';

const ROOT_PATH = join(__dirname, '../..');
const TEST_FILE_PATH = join(ROOT_PATH, 'tests/test-files');
const UPLOAD_PATH = join(ROOT_PATH, 'uploads');
describe('ContentController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT, 10),
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities: [Content],
          synchronize: true,
        }),
        ContentModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Ensure uploads directory exists
    if (!existsSync(UPLOAD_PATH)) {
      mkdirSync(UPLOAD_PATH);
    }
  });

  it('/contents (POST) - should upload an image', () => {
    return request(app.getHttpServer())
      .post('/contents')
      .attach('file', join(TEST_FILE_PATH, 'test-image.jpg'))
      .expect(201)
      .then((response) => {
        expect(response.body.message).toBe('File uploaded successfully');
        expect(response.body.file.filePath).toContain('uploads/file-');
      });
  });

  it('/contents (POST) - should upload a video', () => {
    return request(app.getHttpServer())
      .post('/contents')
      .attach('file', join(TEST_FILE_PATH, 'test-video.mp4'))
      .expect(201)
      .then((response) => {
        expect(response.body.message).toBe('File uploaded successfully');
        expect(response.body.file.filePath).toContain('uploads/file-');
      });
  });

  it('/contents (POST) - should upload a PDF', () => {
    return request(app.getHttpServer())
      .post('/contents')
      .attach('file', join(TEST_FILE_PATH, 'test-file.pdf'))
      .expect(201)
      .then((response) => {
        expect(response.body.message).toBe('File uploaded successfully');
        expect(response.body.file.filePath).toContain('uploads/file-');
      });
  });

  it('/contents (POST) - should reject unsupported file type', () => {
    return request(app.getHttpServer())
      .post('/contents')
      .attach('file', join(TEST_FILE_PATH, 'test-file.txt'))
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe('File type not supported');
      });
  });

  it('/contents (POST) - should reject file larger than 10MB', () => {
    return request(app.getHttpServer())
      .post('/contents')
      .attach('file', join(TEST_FILE_PATH, 'large-file.mp4'))
      .expect(413)
      .then((response) => {
        expect(response.body.message).toBe('File too large');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
