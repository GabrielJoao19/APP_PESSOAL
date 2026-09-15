import { IsString, IsInt, IsOptional } from 'class-validator';

export class AtualizarEnvelopeDto {
  @IsString({ message: 'O valor deve ser um texto' })
  @IsOptional()
  nome?: string;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsOptional()
  limite?: number;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsOptional()
  valor_gasto?: number;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsOptional()
  usuarioId?: number;
}
