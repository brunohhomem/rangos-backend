import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  const config = new DocumentBuilder()
    .setTitle('rangos.pro 🍉')
    .setDescription('API do rangos.pro')
    .setVersion('1.0')
    .addTag('alimentos')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
