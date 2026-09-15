import { IsEmail, IsString } from 'class-validator';

export class createLoginDTO{

    @IsEmail({},{message: 'tem que ta no formato de email'})
    email!: string;

    @IsString({message : 'tem que ser uma string'})
    senha : string

}