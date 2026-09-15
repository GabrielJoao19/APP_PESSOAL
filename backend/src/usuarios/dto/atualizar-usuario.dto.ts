import { IsEmail, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class AtualizarUsuarioDto {
  @IsString({ message: 'O nome precisa ser um texto válido' })
  @IsOptional()
  nome?: string;

  @IsEmail({}, { message: 'O e-mail precisa ser um e-mail válido' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'A senha precisa ser um texto válido' })
  @IsOptional()
  @MinLength(6, { message: 'A senha precisa ter no mínimo 6 caracteres' })
  senha?: string;

  @IsInt({ message: 'O limite diário precisa ser um número inteiro válido' })
  @IsOptional()
  limite_diario?: number;
}
