import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  INestApplication,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static instance: PrismaService;
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
    PrismaService.instance = this;
    return PrismaService.instance;
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('📴 Desconectado do banco de dados');
  }

  enableShutdownHooks(app: INestApplication) {
    app.enableShutdownHooks();
  }

  private async connectWithRetry(retries = 5, delayMs = 5000) {
    for (let i = 0; i < retries; i++) {
      try {
        await this.$connect();
        this.logger.log('📦 Conectado ao banco de dados com Prisma');
        return;
      } catch (error) {
        this.logger.error(
          `Erro ao conectar ao banco (${i + 1}/${retries}): ${error.message}`,
        );
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }
    this.logger.error('Falha ao conectar ao banco após várias tentativas.');
  }
}
