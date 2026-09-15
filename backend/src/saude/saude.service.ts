import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMetaFitnessDto, UpdateMetaFitnessDto } from './dto/meta-fitness.dto.js';
import { CreateHistoricoFitnessDto, UpdateHistoricoFitnessDto } from './dto/historico-fitness.dto.js';

@Injectable()
export class SaudeService {
  constructor(private prisma: PrismaService) {}

  // --- Meta Fitness ---
  criarMetaFitness(dados: CreateMetaFitnessDto) {
    return this.prisma.meta_Fitness.create({ data: dados });
  }

  listarMetasFitness() {
    return this.prisma.meta_Fitness.findMany({ include: { historico: true } });
  }

  async buscarMetaFitness(id: number) {
    const meta = await this.prisma.meta_Fitness.findUnique({ where: { id }, include: { historico: true } });
    if (!meta) throw new NotFoundException('Meta Fitness não encontrada');
    return meta;
  }

  async atualizarMetaFitness(id: number, dados: UpdateMetaFitnessDto) {
    await this.buscarMetaFitness(id);
    return this.prisma.meta_Fitness.update({ where: { id }, data: dados });
  }

  async deletarMetaFitness(id: number) {
    await this.buscarMetaFitness(id);
    return this.prisma.meta_Fitness.delete({ where: { id } });
  }

  // --- Historico Fitness ---
  criarHistoricoFitness(dados: CreateHistoricoFitnessDto) {
    return this.prisma.historicoFitness.create({ data: dados });
  }

  listarHistoricosFitness() {
    return this.prisma.historicoFitness.findMany();
  }

  async buscarHistoricoFitness(id: number) {
    const historico = await this.prisma.historicoFitness.findUnique({ where: { id } });
    if (!historico) throw new NotFoundException('Histórico Fitness não encontrado');
    return historico;
  }

  async atualizarHistoricoFitness(id: number, dados: UpdateHistoricoFitnessDto) {
    await this.buscarHistoricoFitness(id);
    return this.prisma.historicoFitness.update({ where: { id }, data: dados });
  }

  async deletarHistoricoFitness(id: number) {
    await this.buscarHistoricoFitness(id);
    return this.prisma.historicoFitness.delete({ where: { id } });
  }
}
