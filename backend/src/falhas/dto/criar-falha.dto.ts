import { IsString, IsNotEmpty, IsInt, Min, MaxLength } from 'class-validator';

export class FalhaDTO {

    @IsString({message: 'tem que ser no formato string'})
    @IsNotEmpty({message: 'campo nao veio preenchido'})
    @MaxLength(150, {message: 'A descricao não pode ter mais que 150 caracteres'})
    descricao: string;

    @IsInt({message: 'tem que vir como inteiro'})
    @Min(0, {message: 'O valor não pode ser negativo'})
    @IsNotEmpty({message: 'campo nao veio preenchido'})
    valor_diario: number;

    @IsInt({ message: 'O ID da categoria precisa ser um número inteiro' })
    @IsNotEmpty({ message: 'Você precisa informar a qual categoria esta falha pertence' })
    @Min(1)
    categoriaId: number;

    @IsInt({ message: 'O ID do usuário precisa ser um número inteiro' })
    @IsNotEmpty({ message: 'Você precisa informar o usuário' })
    @Min(1)
    usuarioId: number;

}