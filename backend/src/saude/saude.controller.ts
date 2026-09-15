import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { SaudeService } from './saude.service.js';
import { CreateMetaFitnessDto, UpdateMetaFitnessDto } from './dto/meta-fitness.dto.js';
import { CreateHistoricoFitnessDto, UpdateHistoricoFitnessDto } from './dto/historico-fitness.dto.js';
@Controller('saude')
@UseGuards(JwtAuthGuard)
export class SaudeController {
  constructor(private readonly saudeService: SaudeService) {}

  // --- Meta Fitness ---
  @Post('metas-fitness')
  criarMetaFitness(@Body() dados: CreateMetaFitnessDto) {
    return this.saudeService.criarMetaFitness(dados);
  }

  @Get('metas-fitness')
  listarMetasFitness() {
    return this.saudeService.listarMetasFitness();
  }

  @Get('metas-fitness/:id')
  buscarMetaFitness(@Param('id', ParseIntPipe) id: number) {
    return this.saudeService.buscarMetaFitness(id);
  }

  @Patch('metas-fitness/:id')
  atualizarMetaFitness(@Param('id', ParseIntPipe) id: number, @Body() dados: UpdateMetaFitnessDto) {
    return this.saudeService.atualizarMetaFitness(id, dados);
  }

  @Delete('metas-fitness/:id')
  deletarMetaFitness(@Param('id', ParseIntPipe) id: number) {
    return this.saudeService.deletarMetaFitness(id);
  }

  // --- Historico Fitness ---
  @Post('historicos-fitness')
  criarHistoricoFitness(@Body() dados: CreateHistoricoFitnessDto) {
    return this.saudeService.criarHistoricoFitness(dados);
  }

  @Get('historicos-fitness')
  listarHistoricosFitness() {
    return this.saudeService.listarHistoricosFitness();
  }

  @Get('historicos-fitness/:id')
  buscarHistoricoFitness(@Param('id', ParseIntPipe) id: number) {
    return this.saudeService.buscarHistoricoFitness(id);
  }

  @Patch('historicos-fitness/:id')
  atualizarHistoricoFitness(@Param('id', ParseIntPipe) id: number, @Body() dados: UpdateHistoricoFitnessDto) {
    return this.saudeService.atualizarHistoricoFitness(id, dados);
  }

  @Delete('historicos-fitness/:id')
  deletarHistoricoFitness(@Param('id', ParseIntPipe) id: number) {
    return this.saudeService.deletarHistoricoFitness(id);
  }
}
