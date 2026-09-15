import { IsString, IsNumber, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateMetaFitnessDto {
  @IsString({ message: 'O nome deve ser um texto' })
  nome: string;

  @IsString({ message: 'A unidade deve ser um texto' })
  unidade: string;

  @IsNumber({}, { message: 'O valor atual deve ser um número' })
  valor_atual: number;

  @IsNumber({}, { message: 'O valor alvo deve ser um número' })
  valor_alvo: number;

  @IsOptional()
  @IsDateString({}, { message: 'A data limite deve ser uma data válida' })
  data_limite?: string;

  @IsInt({ message: 'O id do usuário deve ser um número inteiro' })
  usuarioId: number;
}

export class UpdateMetaFitnessDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto' })
  nome?: string;

  @IsOptional()
  @IsString({ message: 'A unidade deve ser um texto' })
  unidade?: string;

  @IsOptional()
  @IsNumber({}, { message: 'O valor atual deve ser um número' })
  valor_atual?: number;

  @IsOptional()
  @IsNumber({}, { message: 'O valor alvo deve ser um número' })
  valor_alvo?: number;

  @IsOptional()
  @IsDateString({}, { message: 'A data limite deve ser uma data válida' })
  data_limite?: string;
}
