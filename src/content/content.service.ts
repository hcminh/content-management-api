import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './content.entity';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ROOT_PATH, UPLOAD_FOLDER } from '../constants/file';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  async handleFileUpload(file: Express.Multer.File) {
    const newContent = this.contentRepository.create({
      filePath: join(UPLOAD_FOLDER, file.filename),
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });
    await this.contentRepository.save(newContent);
    return {
      message: 'File uploaded successfully',
      file: {
        ...newContent,
      },
    };
  }

  async getContentById(
    id: string,
  ): Promise<{ content: Content; fileStream: NodeJS.ReadableStream }> {
    const content = await this.contentRepository.findOne({
      where: { id },
    });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    const filePath = join(ROOT_PATH, content.filePath);
    const fileStream = createReadStream(filePath);
    return { content, fileStream };
  }
}
