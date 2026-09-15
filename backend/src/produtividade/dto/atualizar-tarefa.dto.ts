import { IsString, IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';

export class AtualizarTarefaDto {
  @IsOptional()
  @IsString({ message: 'O título precisa ser um texto' })
  titulo?: string;

  @IsOptional()
  @IsNumber({}, { message: 'O valor da tarefa precisa ser numérico' })
  @Min(1, { message: 'A tarefa deve valer no mínimo 1 XP' })
  valor_diario?: number;

  @IsOptional()
  @IsBoolean({ message: 'A conclusão precisa ser booleana' })
  concluida?: boolean;
}
