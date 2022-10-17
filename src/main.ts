import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder().addBearerAuth()
   .setTitle('tourism documentation')
   .build()
   const document = SwaggerModule.createDocument(app,config)
   await SwaggerModule.setup('api',app,document)
  await app.listen(3000);
}
bootstrap();
