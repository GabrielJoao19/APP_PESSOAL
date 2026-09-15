import { Module } from '@nestjs/common';
import { FinancasController } from './financas.controller.js';
import { FinancasService } from './financas.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [FinancasController],
  providers: [FinancasService]
})
export class FinancasModule {}
