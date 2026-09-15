import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UsuariosService } from './usuarios.service.js';
import { CriarUsuarioDto } from './dto/criar-usuario.dto.js';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto.js';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  criarUsuario(@Body() dados: CriarUsuarioDto) {
    return this.usuariosService.criarUsuario(dados);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  listarUsuarios() {
    return this.usuariosService.listarUsuarios();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  buscarUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.buscarUsuario(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  atualizarUsuario(@Param('id', ParseIntPipe) id: number, @Body() dados: AtualizarUsuarioDto) {
    return this.usuariosService.atualizarUsuario(id, dados);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletarUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.deletarUsuario(id);
  }
}
