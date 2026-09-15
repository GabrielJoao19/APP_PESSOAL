import { IsString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';

export class CriarInvestimentoDto {
  @IsString({ message: 'O valor deve ser um texto' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  nome: string;

  @IsString({ message: 'O valor deve ser um texto' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  tipo: string;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  valor_investido: number;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  valor_atual: number;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  tipoInvestimentoId: number;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  usuarioId: number;
}
