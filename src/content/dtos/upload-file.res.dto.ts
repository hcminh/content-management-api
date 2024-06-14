import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty()
  filePath: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  id: string;
}

export class UploadResponseDto {
  @ApiProperty({ example: 'File uploaded successfully' })
  message: string;

  @ApiProperty({ type: FileDto })
  file: FileDto;
}
