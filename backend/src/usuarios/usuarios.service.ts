import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CriarUsuarioDto } from './dto/criar-usuario.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async criarUsuario(dados: CriarUsuarioDto) {
    const saltrounds = 10;
    const senhaHasheada = await bcrypt.hash(dados.senha, saltrounds);
    dados.senha = senhaHasheada;

    try {
      await this.prisma.usuario.create({ data: dados });
    } catch (error) {
      if (error.code === 'P2002') { // Código de erro do Prisma para violação de constraint única
        throw new ConflictException(`E-mail já cadastrado`);
      }
      throw error;
    }
  }

  listarUsuarios() {
    return this.prisma.usuario.findMany({
      include: {
        envelopes: true,
        gastos: true,
        diarios: true,
        tarefas: true,
        falhas: true,
        metas_financeiras: true,
        metas_fitness: true,
        investimentos: true
      }
    });
  }

  async buscarUsuario(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuário não encontrado`);
    }
    return usuario;
  }

  async atualizarUsuario(id: number, dados: AtualizarUsuarioDto) {
    await this.buscarUsuario(id);
    return this.prisma.usuario.update({ where: { id }, data: dados });
  }

  async deletarUsuario(id: number) {
    await this.buscarUsuario(id);
    return this.prisma.usuario.delete({ where: { id } });
  }

  buscarUsuarioEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }
}
