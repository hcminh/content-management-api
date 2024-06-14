import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ContentService } from './content.service';
import { join } from 'path';
import { FILE_SIZE, UPLOAD_PATH } from '../constants/file';
import { FileDomain } from '../domains/file';
import { Response } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { FileUploadDto } from './dtos/upload-file.req.dto';
import { UploadResponseDto } from './dtos/upload-file.res.dto';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: FileUploadDto,
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: UploadResponseDto,
  })
  @ApiResponse({
    status: 413,
    description: 'Bad request: File type not supported or file size too large',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(UPLOAD_PATH),
        filename: (_, file, cb) => FileDomain.generateName(file, cb),
      }),
      fileFilter: (_, file, cb) =>
        FileDomain.fileFilter({ ...file, stream: null }, cb),
      limits: {
        fileSize: FILE_SIZE,
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.contentService.handleFileUpload(file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiResponse({ status: 200, description: 'Return the file and its metadata' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async getContentById(@Param('id') id: string, @Res() res: Response) {
    const { content, fileStream } =
      await this.contentService.getContentById(id);
    res.set({
      'Content-Type': content.mimeType,
      'Content-Disposition': `attachment; filename="${content.originalName}"`,
    });
    fileStream.pipe(res);
  }
}
