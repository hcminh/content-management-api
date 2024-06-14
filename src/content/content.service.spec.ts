import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentService } from './content.service';
import { Content } from './content.entity';
import { NotFoundException } from '@nestjs/common';

const mockContentRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ContentService', () => {
  let service: ContentService;
  let repository: MockRepository<Content>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: getRepositoryToken(Content),
          useFactory: mockContentRepository,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    repository = module.get<MockRepository<Content>>(
      getRepositoryToken(Content),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a success message with file path', async () => {
    const mockFile = {
      path: 'uploads/test-file.png',
      originalname: 'test-file.png',
      mimetype: 'image/png',
      size: 1024,
      filename: 'test-file.png',
    } as Express.Multer.File;
    const result = { id: 'uuid', ...mockFile };

    repository.create!.mockReturnValue(result);
    repository.save!.mockResolvedValue(result);

    expect(await service.handleFileUpload(mockFile)).toEqual({
      message: 'File uploaded successfully',
      file: result,
    });
  });

  it('should return content by id', async () => {
    const id = 'ae8a8897-409d-4e3c-b075-4f5059f9cc43';
    const result = {
      id,
      filePath: 'uploads/file-mock.pdf',
      originalName: 'test-file.pdf',
      mimeType: 'application/pdf',
      size: 7478,
    };

    repository.findOne!.mockResolvedValue(result);

    const { content, fileStream } = await service.getContentById(id);

    expect(content).toEqual(result);
    expect(fileStream).toBeDefined();
  });

  it('should throw NotFoundException if content not found', async () => {
    const id = 'uuid';

    repository.findOne!.mockResolvedValue(null);

    await expect(service.getContentById(id)).rejects.toThrow(NotFoundException);
  });
});
