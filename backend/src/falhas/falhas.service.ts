import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { FalhaDTO } from './dto/criar-falha.dto.js';

@Injectable()
export class FalhasService {
  constructor(private prisma: PrismaService) {}

  async criarFalha(dados: FalhaDTO) {
    return this.prisma.falha.create({
      data: dados,
      include: { categoria: true }
    });
  }

  async buscarTodasFalhas() {
    return this.prisma.falha.findMany({
      include: { categoria: true },
      orderBy: { criadoEm: 'desc' }
    });
  }

  async buscarFalhaPorId(id: number) {
    const falha = await this.prisma.falha.findUnique({
      where: { id },
      include: { categoria: true }
    });
    
    if (!falha) {
      throw new NotFoundException(`Nenhuma falha encontrada com o ID ${id}`);
    }
    return falha;
  }

  async atualizarFalha(id: number, dados: FalhaDTO) {
    await this.buscarFalhaPorId(id);
    return this.prisma.falha.update({
      where: { id },
      data: dados,
      include: { categoria: true }
    });
  }

  async deletarFalha(id: number) {
    await this.buscarFalhaPorId(id);
    return this.prisma.falha.delete({
      where: { id }
    });
  }
}
