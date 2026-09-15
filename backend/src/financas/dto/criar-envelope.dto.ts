import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CriarEnvelopeDto {
  @IsString({ message: 'O valor deve ser um texto' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  nome: string;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsOptional()
  limite?: number;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsOptional()
  valor_gasto?: number;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  usuarioId: number;
}
