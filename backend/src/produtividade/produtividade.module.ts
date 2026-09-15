import { Module } from '@nestjs/common';
import { ProdutividadeController } from './produtividade.controller.js';
import { ProdutividadeService } from './produtividade.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ProdutividadeController],
  providers: [ProdutividadeService],
  exports: [ProdutividadeService]
})
export class ProdutividadeModule { }
