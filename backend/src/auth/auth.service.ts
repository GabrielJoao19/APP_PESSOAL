import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuariosService,
    private readonly jwtService: JwtService) {}

    async login (email: string, senhaLimpa: string){
        const usuario = await this.usuarioService.buscarUsuarioEmail(email);

        if (!usuario){
            throw new UnauthorizedException('Credenciais invalidas')
        }
        const senhaBateu = await bcrypt.compare(senhaLimpa, usuario.senha);

        if (!senhaBateu){
            throw new UnauthorizedException('Credenciais invalidas')
        }

        const payload = { sub: usuario.id, email: usuario.email };
        return {
            access_token: this.jwtService.sign(payload),
            acces_token: this.jwtService.sign(payload),
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                limite_diario: usuario.limite_diario
            }
        };
    }
}
