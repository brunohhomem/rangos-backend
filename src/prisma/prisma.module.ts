import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Permite que o módulo seja acessível globalmente
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Permite injetar PrismaService em outros módulos
})
export class PrismaModule {}
