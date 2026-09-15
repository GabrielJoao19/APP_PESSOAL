import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CriarGastoDto {
  @IsString({ message: 'O valor deve ser um texto' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  descricao: string;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  valor: number;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  usuarioId: number;

  @IsInt({ message: 'O valor deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  envelopeId: number;
}
