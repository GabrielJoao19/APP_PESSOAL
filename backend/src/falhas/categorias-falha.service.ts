import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CategoriaFalhaDTO } from './dto/criar-categoria-falha.dto.js';

@Injectable()
export class CategoriasFalhaService {
  constructor(private prisma: PrismaService) {}

  async criarCategoriaFalha(dados: CategoriaFalhaDTO) {
    return this.prisma.categoriaFalha.create({ data: dados });
  }

  async buscarTodasCategoriasFalha() {
    return this.prisma.categoriaFalha.findMany();
  }

  async buscarCategoriaFalhaPorId(id: number) {
    const categoria = await this.prisma.categoriaFalha.findUnique({ where: { id } });
    if (!categoria) {
      throw new NotFoundException(`Nenhuma categoria encontrada com o ID ${id}`);
    }
    return categoria;
  }

  async atualizarCategoriaFalha(id: number, dados: CategoriaFalhaDTO) {
    await this.buscarCategoriaFalhaPorId(id); 
    return this.prisma.categoriaFalha.update({ where: { id }, data: dados });
  }

  async deletarCategoriaFalha(id: number) {
    await this.buscarCategoriaFalhaPorId(id);
    return this.prisma.categoriaFalha.delete({ where: { id } });
  }
}
