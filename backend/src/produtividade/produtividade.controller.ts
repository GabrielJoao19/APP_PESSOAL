import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ProdutividadeService } from './produtividade.service.js';
import { CriarTarefaDto } from './dto/criar-tarefa.dto.js';
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto.js';
import { CriarDiarioDto } from './dto/criar-diario.dto.js';
import { AtualizarDiarioDto } from './dto/atualizar-diario.dto.js';

@Controller('produtividade')
@UseGuards(JwtAuthGuard)
export class ProdutividadeController {
  constructor(private readonly produtividadeService: ProdutividadeService) {}

  // --- TAREFAS ---
  @Post('tarefas')
  criarTarefa(@Body() dto: CriarTarefaDto) {
    return this.produtividadeService.criarTarefa(dto);
  }

  @Get('tarefas')
  listarTarefas() {
    return this.produtividadeService.listarTarefas();
  }

  @Patch('tarefas/:id')
  atualizarTarefa(@Param('id', ParseIntPipe) id: number, @Body() dados: AtualizarTarefaDto) {
    return this.produtividadeService.atualizarTarefa(id, dados);
  }

  @Delete('tarefas/:id')
  deletarTarefa(@Param('id', ParseIntPipe) id: number) {
    return this.produtividadeService.deletarTarefa(id);
  }

  // --- DIARIOS ---
  @Post('diarios')
  criarDiario(@Body() dados: CriarDiarioDto) {
    return this.produtividadeService.criarDiario(dados);
  }

  @Get('diarios')
  listarDiarios() {
    return this.produtividadeService.listarDiarios();
  }

  @Get('diarios/:id')
  buscarDiario(@Param('id', ParseIntPipe) id: number) {
    return this.produtividadeService.buscarDiario(id);
  }

  @Patch('diarios/:id')
  atualizarDiario(@Param('id', ParseIntPipe) id: number, @Body() dados: AtualizarDiarioDto) {
    return this.produtividadeService.atualizarDiario(id, dados);
  }

  @Delete('diarios/:id')
  deletarDiario(@Param('id', ParseIntPipe) id: number) {
    return this.produtividadeService.deletarDiario(id);
  }
}
