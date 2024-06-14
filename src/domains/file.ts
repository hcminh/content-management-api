import { extname } from 'path';
import { generateSuffix } from '../utils/unique-suffix';
import { BadRequestException } from '@nestjs/common';

type Callback = (error: Error | null, data: any) => void;

export class FileDomain {
  static generateName(file: Express.Multer.File, callback: Callback) {
    const uniqueSuffix = generateSuffix();
    const ext = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }

  static fileFilter(file: Express.Multer.File, callback: Callback) {
    const allowedTypes = /jpeg|jpg|png|mp4|pdf/;
    const ext = extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    if (allowedTypes.test(ext) && allowedTypes.test(mimeType)) {
      return callback(null, true);
    }
    return callback(new BadRequestException('File type not supported'), false);
  }
}
