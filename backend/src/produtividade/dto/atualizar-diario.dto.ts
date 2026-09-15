import { IsString, IsOptional } from 'class-validator';

export class AtualizarDiarioDto {
  @IsOptional()
  @IsString({ message: 'O título precisa ser um texto' })
  titulo?: string;

  @IsOptional()
  @IsString({ message: 'O conteúdo precisa ser um texto' })
  conteudo?: string;
}
