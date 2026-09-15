import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { FinancasService } from './financas.service.js';
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

@Controller('financas')
@UseGuards(JwtAuthGuard)
export class FinancasController {
  constructor(private readonly financasService: FinancasService) {}

  // --- Envelope ---
  @Post('envelopes')
  criarEnvelope(@Body() dados: CriarEnvelopeDto) { return this.financasService.criarEnvelope(dados); }
  @Get('envelopes')
  listarEnvelopes() { return this.financasService.listarEnvelopes(); }
  @Get('envelopes/:id')
  buscarEnvelope(@Param('id', ParseIntPipe) id: number) { return this.financasService.buscarEnvelope(id); }
  @Patch('envelopes/:id')
  atualizarEnvelope(@Param('id', ParseIntPipe) id: number, @Body() dados: AtualizarEnvelopeDto) { return this.financasService.atualizarEnvelope(id, dados); }
  @Delete('envelopes/:id')
  deletarEnvelope(@Param('id', ParseIntPipe) id: number) { return this.financasService.deletarEnvelope(id); }

  // --- Gasto ---
  @Post('gastos')
  criarGasto(@Body() dados: CriarGastoDto) { return this.financasService.criarGasto(dados); }
  @Get('gastos')
  listarGastos() { return this.financasService.listarGastos(); }
  @Get('gastos/:id')
  buscarGasto(@Param('id', ParseIntPipe) id: number) { return this.financasService.buscarGasto(id); }
  @Patch('gastos/:id')
  atualizarGasto(@Param('id', ParseIntPipe) id: number, @Body() dados: AtualizarGastoDto) { return this.financasService.atualizarGasto(id, dados); }
  @Delete('gastos/:id')
  deletarGasto(@Param('id', ParseIntPipe) id: number) { return this.financasService.deletarGasto(id); }

  // --- TipoInvestimento ---
  @Post('tipos-investimento')
  criarTipoInvestimento(@Body() dados: CriarTipoInvestimentoDto) { return this.financasService.criarTipoInvestimento(dados); }
  @Get('tipos-investimento')
  listarTiposInvestimento() { return this.financasService.listarTiposInvestimento(); }
  @Get('tipos-investimento/:id')
  buscarTipoInvestimento(@Param('id', ParseIntPipe) id: number) { return this.financasService.buscarTipoInvestimento(id); }
  @Patch('tipos-investimento/:id')
  atualizarTipoInvestimento(@Param('id', ParseIntPipe) id: number, @Body() dados: AtualizarTipoInvestimentoDto) { return this.financasService.atualizarTipoInvestimento(id, dados); }
  @Delete('tipos-investimento/:id')
  deletarTipoInvestimento(@Param('id', ParseIntPipe) id: number) { return this.financasService.deletarTipoInvestimento(id); }

  // --- Investimento ---
  @Post('investimentos')
  criarInvestimento(@Body() dados: CriarInvestimentoDto) { return this.financasService.criarInvestimento(dados); }
  @Get('investimentos')
  listarInvestimentos() { return this.financasService.listarInvestimentos(); }
  @Get('investimentos/:id')
  buscarInvestimento(@Param('id', ParseIntPipe) id: number) { return this.financasService.buscarInvestimento(id); }
  @Patch('investimentos/:id')
  atualizarInvestimento(@Param('id', ParseIntPipe) id: number, @Body() dados: AtualizarInvestimentoDto) { return this.financasService.atualizarInvestimento(id, dados); }
  @Delete('investimentos/:id')
  deletarInvestimento(@Param('id', ParseIntPipe) id: number) { return this.financasService.deletarInvestimento(id); }

  // --- Meta_Financeira ---
  @Post('metas-financeiras')
  criarMetaFinanceira(@Body() dados: CriarMetaFinanceiraDto) { return this.financasService.criarMetaFinanceira(dados); }
  @Get('metas-financeiras')
  listarMetasFinanceiras() { return this.financasService.listarMetasFinanceiras(); }
  @Get('metas-financeiras/:id')
  buscarMetaFinanceira(@Param('id', ParseIntPipe) id: number) { return this.financasService.buscarMetaFinanceira(id); }
  @Patch('metas-financeiras/:id')
  atualizarMetaFinanceira(@Param('id', ParseIntPipe) id: number, @Body() dados: AtualizarMetaFinanceiraDto) { return this.financasService.atualizarMetaFinanceira(id, dados); }
  @Delete('metas-financeiras/:id')
  deletarMetaFinanceira(@Param('id', ParseIntPipe) id: number) { return this.financasService.deletarMetaFinanceira(id); }
}
