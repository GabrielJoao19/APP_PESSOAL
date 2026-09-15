import { Module } from '@nestjs/common';
import { FalhasController } from './falhas.controller.js';
import { FalhasService } from './falhas.service.js';
import { CategoriasFalhaController } from './categorias-falha.controller.js';
import { CategoriasFalhaService } from './categorias-falha.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [FalhasController, CategoriasFalhaController],
  providers: [FalhasService, CategoriasFalhaService],
  exports: [FalhasService, CategoriasFalhaService]
})
export class FalhasModule { }
