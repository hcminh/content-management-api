import { NestFactory } from '@nestjs/core';
import { ContentModule } from './content/content.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ContentModule);
  const config = new DocumentBuilder()
    .setTitle('Content Management API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(3000);

  console.log(
    'Check out the documentation at http://localhost:3000/documentation',
  );
}
bootstrap();
