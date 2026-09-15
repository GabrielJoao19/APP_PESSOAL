import { IsString, IsNotEmpty, MaxLength, IsInt, Min } from 'class-validator';

export class CategoriaFalhaDTO {

    @IsString({message: 'tem que ser no formato string'})
    @IsNotEmpty({message: 'campo nao veio preenchido'})
    @MaxLength(150, {message: 'O nome não pode ter mais que 150 caracteres'})
    nome: string;

    @IsInt({message: 'tem que vir como inteiro'})
    @Min(0,{message: "O valor não pode ser negativo"})
    @IsNotEmpty({message: 'campo nao veio preenchido'})
    valor: number;

}