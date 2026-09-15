import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CriarTarefaDto } from './dto/criar-tarefa.dto.js';
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto.js';
import { CriarDiarioDto } from './dto/criar-diario.dto.js';
import { AtualizarDiarioDto } from './dto/atualizar-diario.dto.js';

@Injectable()
export class ProdutividadeService {
    constructor(private prisma: PrismaService) { }

    // Criar Tarefa
    async criarTarefa(dados: CriarTarefaDto) {
        return this.prisma.tarefa.create({
            data: dados,
            include: { usuario: true }
        });
    }

    // Listar Tarefas
    async listarTarefas() {
        return this.prisma.tarefa.findMany({
            include: { usuario: true },
            orderBy: { criadoEm: 'desc' }
        });
    }

    // Atualizar Tarefa (Marcar como feita ou Editar)
    async atualizarTarefa(id: number, dados: AtualizarTarefaDto) {
        const tarefa = await this.prisma.tarefa.findUnique({ where: { id } });
        if (!tarefa) {
            throw new NotFoundException('Tarefa não encontrada');
        }
        return this.prisma.tarefa.update({
            where: { id },
            data: dados,
            include: { usuario: true }
        });
    }

    // Deletar Tarefa
    async deletarTarefa(id: number) {
        const tarefa = await this.prisma.tarefa.findUnique({ where: { id } });
        if (!tarefa) {
            throw new NotFoundException('Tarefa não encontrada');
        }
        return this.prisma.tarefa.delete({ where: { id } });
    }

    // Criar Diário
    async criarDiario(dados: CriarDiarioDto) {
        return this.prisma.diario.create({
            data: dados,
            include: { usuario: true }
        });
    }

    // Listar Diários
    async listarDiarios() {
        return this.prisma.diario.findMany({
            include: { usuario: true },
            orderBy: { criadoEm: 'desc' }
        });
    }

    // Buscar Diário
    async buscarDiario(id: number) {
        const diario = await this.prisma.diario.findUnique({
            where: { id },
            include: { usuario: true }
        });
        if (!diario) {
            throw new NotFoundException('Diário não encontrado');
        }
        return diario;
    }

    // Atualizar Diário
    async atualizarDiario(id: number, dados: AtualizarDiarioDto) {
        const diario = await this.prisma.diario.findUnique({ where: { id } });
        if (!diario) {
            throw new NotFoundException('Diário não encontrado');
        }
        return this.prisma.diario.update({
            where: { id },
            data: dados,
            include: { usuario: true }
        });
    }

    // Deletar Diário
    async deletarDiario(id: number) {
        const diario = await this.prisma.diario.findUnique({ where: { id } });
        if (!diario) {
            throw new NotFoundException('Diário não encontrado');
        }
        return this.prisma.diario.delete({ where: { id } });
    }
}
