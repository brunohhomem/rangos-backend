import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'], // Log opcional para debugging
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('📦 Conectado ao banco de dados com Prisma');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('📴 Desconectado do banco de dados');
  }

  enableShutdownHooks(app: INestApplication) {
    app.enableShutdownHooks();
  }
}
