import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CategoriasFalhaService } from './categorias-falha.service.js';
import { CategoriaFalhaDTO } from './dto/criar-categoria-falha.dto.js';

@Controller('categorias-falha')
@UseGuards(JwtAuthGuard)
export class CategoriasFalhaController {
  constructor(private readonly categoriasFalhaService: CategoriasFalhaService) {}

  @Post()
  criarCategoria(@Body() dados: CategoriaFalhaDTO) {
    return this.categoriasFalhaService.criarCategoriaFalha(dados);
  }

  @Get()
  buscarTodasCategorias() {
    return this.categoriasFalhaService.buscarTodasCategoriasFalha();
  }

  @Get(':id')
  buscarUmaCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasFalhaService.buscarCategoriaFalhaPorId(id);
  }

  @Patch(':id')
  atualizarCategoria(@Param('id', ParseIntPipe) id: number, @Body() dados: CategoriaFalhaDTO) {
    return this.categoriasFalhaService.atualizarCategoriaFalha(id, dados);
  }

  @Delete(':id')
  deletarCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasFalhaService.deletarCategoriaFalha(id);
  }
}
