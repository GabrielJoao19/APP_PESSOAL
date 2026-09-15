import { IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

export class AtualizarInvestimentoDto {
  @IsString({ message: 'O valor deve ser um texto' })
  @IsOptional()
  nome?: string;

  @IsString({ message: 'O valor deve ser um texto' })
  @IsOptional()
  tipo?: string;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsOptional()
  valor_investido?: number;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsOptional()
  valor_atual?: number;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsOptional()
  tipoInvestimentoId?: number;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsOptional()
  usuarioId?: number;
}
