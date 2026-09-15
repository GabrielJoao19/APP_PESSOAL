import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { FalhasService } from './falhas.service.js';
import { FalhaDTO } from './dto/criar-falha.dto.js';

@Controller('falhas')
@UseGuards(JwtAuthGuard)
export class FalhasController {
  constructor(private readonly falhasService: FalhasService) {}

  @Post()
  criar(@Body() dados: FalhaDTO) {
    return this.falhasService.criarFalha(dados);
  }

  @Get()
  buscarTodas() {
    return this.falhasService.buscarTodasFalhas();
  }

  @Get(':id')
  buscarUma(@Param('id', ParseIntPipe) id: number) {
    return this.falhasService.buscarFalhaPorId(id);
  }

  @Patch(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dados: FalhaDTO) {
    return this.falhasService.atualizarFalha(id, dados);
  }

  @Delete(':id')
  deletar(@Param('id', ParseIntPipe) id: number) {
    return this.falhasService.deletarFalha(id);
  }
}
