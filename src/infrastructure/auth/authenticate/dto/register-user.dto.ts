import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class RegisterUserDto { 
    @IsNotEmpty({
        message: 'Nome do usuário não pode ser vazio'
    })
    @IsString({
        message: 'Nome do usuário inválido'
    })
    name: string;

    @IsNotEmpty({
        message: 'Sobrenome do usuário não pode ser vazio'
    })
    @IsString({
        message: 'Sobrenome do usuário inválido'
    })
    surname: string;

    @IsNotEmpty({
        message: 'Email do usuário não pode ser vazio'
    })
    @IsEmail({}, {message: 'Email inválido'})
    email: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 0,
        minNumbers: 0,
        minSymbols: 0,
        minUppercase: 0
    },{
        message: 'Senha inválida'
    })
    password: string;
}
