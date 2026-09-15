import { IsString, IsNumber, IsOptional, IsInt, IsDateString } from 'class-validator';

export class AtualizarMetaFinanceiraDto {
  @IsString({ message: 'O valor deve ser um texto' })
  @IsOptional()
  nome?: string;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsOptional()
  valor_alvo?: number;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsOptional()
  valor_atual?: number;

  @IsDateString({}, { message: 'O valor deve ser uma data válida' })
  @IsOptional()
  data_limite?: string;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsOptional()
  usuarioId?: number;
}
