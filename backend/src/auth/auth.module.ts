import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js'

@Module({
  imports: [
    UsuariosModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'lifeos-dev-secret',
      signOptions: { expiresIn: '24h'}
    })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
