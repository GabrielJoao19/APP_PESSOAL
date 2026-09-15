import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CriarMetaFinanceiraDto {
  @IsString({ message: 'O valor deve ser um texto' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  nome: string;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  valor_alvo: number;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsOptional()
  valor_atual?: number;

  @IsDateString({}, { message: 'O valor deve ser uma data válida' })
  @IsOptional()
  data_limite?: string;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  usuarioId: number;
}
