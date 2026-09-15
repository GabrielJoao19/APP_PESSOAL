import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CriarEnvelopeDto } from './dto/criar-envelope.dto.js';
import { AtualizarEnvelopeDto } from './dto/atualizar-envelope.dto.js';
import { CriarGastoDto } from './dto/criar-gasto.dto.js';
import { AtualizarGastoDto } from './dto/atualizar-gasto.dto.js';
import { CriarTipoInvestimentoDto } from './dto/criar-tipo-investimento.dto.js';
import { AtualizarTipoInvestimentoDto } from './dto/atualizar-tipo-investimento.dto.js';
import { CriarInvestimentoDto } from './dto/criar-investimento.dto.js';
import { AtualizarInvestimentoDto } from './dto/atualizar-investimento.dto.js';
import { CriarMetaFinanceiraDto } from './dto/criar-meta-financeira.dto.js';
import { AtualizarMetaFinanceiraDto } from './dto/atualizar-meta-financeira.dto.js';

@Injectable()
export class FinancasService {
  constructor(private prisma: PrismaService) {}

  // --- Envelope ---
  async criarEnvelope(dados: CriarEnvelopeDto) {
    return this.prisma.envelope.create({ data: dados, include: { usuario: true } });
  }
  async listarEnvelopes() {
    return this.prisma.envelope.findMany({ include: { usuario: true, gastos: true } });
  }
  async buscarEnvelope(id: number) {
    const envelope = await this.prisma.envelope.findUnique({ where: { id }, include: { usuario: true, gastos: true } });
    if (!envelope) throw new NotFoundException(`Envelope com ID ${id} não encontrado`);
    return envelope;
  }
  async atualizarEnvelope(id: number, dados: AtualizarEnvelopeDto) {
    await this.buscarEnvelope(id);
    return this.prisma.envelope.update({ where: { id }, data: dados });
  }
  async deletarEnvelope(id: number) {
    await this.buscarEnvelope(id);
    return this.prisma.envelope.delete({ where: { id } });
  }

  // --- Gasto ---
  async criarGasto(dados: CriarGastoDto) {
    return this.prisma.gasto.create({ data: dados, include: { envelope: true, usuario: true } });
  }
  async listarGastos() {
    return this.prisma.gasto.findMany({ include: { envelope: true, usuario: true } });
  }
  async buscarGasto(id: number) {
    const gasto = await this.prisma.gasto.findUnique({ where: { id }, include: { envelope: true, usuario: true } });
    if (!gasto) throw new NotFoundException(`Gasto com ID ${id} não encontrado`);
    return gasto;
  }
  async atualizarGasto(id: number, dados: AtualizarGastoDto) {
    await this.buscarGasto(id);
    return this.prisma.gasto.update({ where: { id }, data: dados });
  }
  async deletarGasto(id: number) {
    await this.buscarGasto(id);
    return this.prisma.gasto.delete({ where: { id } });
  }

  // --- TipoInvestimento ---
  async criarTipoInvestimento(dados: CriarTipoInvestimentoDto) {
    return this.prisma.tipoInvestimento.create({ data: dados });
  }
  async listarTiposInvestimento() {
    return this.prisma.tipoInvestimento.findMany();
  }
  async buscarTipoInvestimento(id: number) {
    const tipo = await this.prisma.tipoInvestimento.findUnique({ where: { id } });
    if (!tipo) throw new NotFoundException(`Tipo de Investimento com ID ${id} não encontrado`);
    return tipo;
  }
  async atualizarTipoInvestimento(id: number, dados: AtualizarTipoInvestimentoDto) {
    await this.buscarTipoInvestimento(id);
    return this.prisma.tipoInvestimento.update({ where: { id }, data: dados });
  }
  async deletarTipoInvestimento(id: number) {
    await this.buscarTipoInvestimento(id);
    return this.prisma.tipoInvestimento.delete({ where: { id } });
  }

  // --- Investimento ---
  async criarInvestimento(dados: CriarInvestimentoDto) {
    return this.prisma.investimento.create({ data: dados, include: { tipoInvestimento: true, usuario: true } });
  }
  async listarInvestimentos() {
    return this.prisma.investimento.findMany({ include: { tipoInvestimento: true, usuario: true } });
  }
  async buscarInvestimento(id: number) {
    const inv = await this.prisma.investimento.findUnique({ where: { id }, include: { tipoInvestimento: true, usuario: true } });
    if (!inv) throw new NotFoundException(`Investimento com ID ${id} não encontrado`);
    return inv;
  }
  async atualizarInvestimento(id: number, dados: AtualizarInvestimentoDto) {
    await this.buscarInvestimento(id);
    return this.prisma.investimento.update({ where: { id }, data: dados });
  }
  async deletarInvestimento(id: number) {
    await this.buscarInvestimento(id);
    return this.prisma.investimento.delete({ where: { id } });
  }

  // --- Meta_Financeira ---
  async criarMetaFinanceira(dados: CriarMetaFinanceiraDto) {
    return this.prisma.meta_Financeira.create({ data: dados, include: { usuario: true } });
  }
  async listarMetasFinanceiras() {
    return this.prisma.meta_Financeira.findMany({ include: { usuario: true } });
  }
  async buscarMetaFinanceira(id: number) {
    const meta = await this.prisma.meta_Financeira.findUnique({ where: { id }, include: { usuario: true } });
    if (!meta) throw new NotFoundException(`Meta Financeira com ID ${id} não encontrada`);
    return meta;
  }
  async atualizarMetaFinanceira(id: number, dados: AtualizarMetaFinanceiraDto) {
    await this.buscarMetaFinanceira(id);
    return this.prisma.meta_Financeira.update({ where: { id }, data: dados });
  }
  async deletarMetaFinanceira(id: number) {
    await this.buscarMetaFinanceira(id);
    return this.prisma.meta_Financeira.delete({ where: { id } });
  }
}
