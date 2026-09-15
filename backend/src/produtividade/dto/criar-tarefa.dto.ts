import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CriarTarefaDto {
  @IsString({ message: 'O título precisa ser um texto' })
  @IsNotEmpty({ message: 'O título não pode ficar em branco!' })
  titulo: string;

  @IsNumber({}, { message: 'O valor da tarefa precisa ser numérico' })
  @Min(1, { message: 'A tarefa deve valer no mínimo 1 XP' })
  valor_diario: number;

  @IsNumber({}, { message: 'O ID do usuário precisa ser um número' })
  usuarioId: number;
}
