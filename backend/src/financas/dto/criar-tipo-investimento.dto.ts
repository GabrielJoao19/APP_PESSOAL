import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CriarTipoInvestimentoDto {
  @IsString({ message: 'O valor deve ser um texto' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  nome: string;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  taxa: number;

  @IsString({ message: 'O valor deve ser um texto' })
  @IsOptional()
  prazo_saque?: string;
}
