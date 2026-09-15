import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CriarUsuarioDto {
  @IsString({ message: 'O nome precisa ser um texto válido' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @IsEmail({}, { message: 'O e-mail precisa ser um e-mail válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @IsString({ message: 'A senha precisa ser um texto válido' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha precisa ter no mínimo 6 caracteres' })
  senha: string;

  @IsInt({ message: 'O limite diário precisa ser um número inteiro válido' })
  @IsOptional()
  limite_diario?: number;
}
