import { UserType } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsEnum, IsNumber } from 'class-validator';


export class CreateAnmProcesses { 

     /**
     * Nome do usuário
     * @example João
     */
    @IsNotEmpty({
        message: 'Número do Processo é obrigatório'
    })
    @IsNumber()
    number: number

     /**
     * Sobrenome do usuário
     * @example Silva
     */

    @IsNotEmpty({
        message: 'Sobrenome do usuário não pode ser vazio'
    })
    @IsString({
        message: 'Sobrenome do usuário inválido'
    })
    surname: string

}


