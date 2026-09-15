import { IsNumber, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateHistoricoFitnessDto {
  @IsNumber({}, { message: 'O valor registrado deve ser um número' })
  valor_registrado: number;

  @IsOptional()
  @IsDateString({}, { message: 'A data de registro deve ser uma data válida' })
  data_registro?: string;

  @IsInt({ message: 'O id da meta deve ser um número inteiro' })
  metaId: number;
}

export class UpdateHistoricoFitnessDto {
  @IsOptional()
  @IsNumber({}, { message: 'O valor registrado deve ser um número' })
  valor_registrado?: number;

  @IsOptional()
  @IsDateString({}, { message: 'A data de registro deve ser uma data válida' })
  data_registro?: string;
}
