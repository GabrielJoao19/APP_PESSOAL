import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CriarDiarioDto {
  @IsString({ message: 'O título precisa ser um texto' })
  @IsNotEmpty({ message: 'O título não pode ficar em branco!' })
  titulo: string;

  @IsString({ message: 'O conteúdo precisa ser um texto' })
  @IsNotEmpty({ message: 'O conteúdo não pode ficar em branco!' })
  conteudo: string;

  @IsNumber({}, { message: 'O ID do usuário precisa ser um número' })
  usuarioId: number;
}
