import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AtualizarTipoInvestimentoDto {
  @IsString({ message: 'O valor deve ser um texto' })
  @IsOptional()
  nome?: string;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsOptional()
  taxa?: number;

  @IsString({ message: 'O valor deve ser um texto' })
  @IsOptional()
  prazo_saque?: string;
}
