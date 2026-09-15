import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { createLoginDTO} from './dto/createLoginDTO.js'
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dados: createLoginDTO){
        return this.authservice.login(dados.email, dados.senha)
    }
}
