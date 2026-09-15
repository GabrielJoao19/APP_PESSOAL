import { IsString, IsInt, IsOptional } from 'class-validator';

export class AtualizarGastoDto {
  @IsString({ message: 'O valor deve ser um texto' })
  @IsOptional()
  descricao?: string;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsOptional()
  valor?: number;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsOptional()
  usuarioId?: number;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsOptional()
  envelopeId?: number;
}
