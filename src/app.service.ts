import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { version } from 'os';
import * as os from 'os';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealthCheck() {
    const dbStatus = await this.checkDatabase();
    return {
      status: 'Server running... 🚀',
      version,
      uptime: process.uptime(), // Tempo em segundos desde que o servidor iniciou
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage(),
      cpuLoad: os.loadavg(),
      database: dbStatus,
    };
  }

  private async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`; // Teste simples de conexão
      return 'Connected ✅';
    } catch (error) {
      return `Error ❌ - ${error.message}`;
    }
  }
}
