import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FinancasController } from './financas.controller.js';
import { FinancasService } from './financas.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [FinancasController],
  providers: [FinancasService]
})
export class FinancasModule {}
