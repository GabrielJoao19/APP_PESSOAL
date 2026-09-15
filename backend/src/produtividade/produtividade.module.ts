import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProdutividadeController } from './produtividade.controller.js';
import { ProdutividadeService } from './produtividade.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ProdutividadeController],
  providers: [ProdutividadeService],
  exports: [ProdutividadeService]
})
export class ProdutividadeModule { }
