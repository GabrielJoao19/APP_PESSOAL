import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { FinancasModule } from './financas/financas.module.js';
import { SaudeModule } from './saude/saude.module.js';
import { ProdutividadeModule } from './produtividade/produtividade.module.js';
import { FalhasModule } from './falhas/falhas.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [PrismaModule, UsuariosModule, FinancasModule, SaudeModule, ProdutividadeModule, FalhasModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
