import { UserType } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsEnum, IsNumber } from 'class-validator';

export enum UserTypeEnum {
    SUPER_ADMIN = 'SUPER_ADMIN',
    DEVELOPER = 'DEVELOPER',
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export class CreateUserDto { 

     /**
     * Nome do usuário
     * @example João
     */
    @IsNotEmpty({
        message: 'Nome do usuário não pode ser vazio'
    })
    @IsString({
        message: 'Nome do usuário inválido'
    })
    name: string

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


     /**
     * Email do usuário
     * @example joaosilva@email.com
     */
    @IsNotEmpty({
        message: 'Email do usuário não pode ser vazio'
    })
    @IsEmail({}, {message: 'Email inválido'})
    email: string

     /**
     * Senha do usuário
     * @example Ab@12345
     */

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 0,
        minNumbers: 0,
        minSymbols: 0,
        minUppercase: 0
    },{
        message: 'Senha inválida'
    })
    password: string

     /**
     * Tipo do usuário "SUPER_ADMIN" | "DEVELOPER" | "ADMIN" | "USER"
     * @example  USER
     */

    @IsEnum(UserTypeEnum, {message: 'Tipo de usuário incorreto'})
    userType: UserType
   
     /**
     * Um array contendo os ids das câmeras que o usuário terá permissão de acesso
     * @example  [1, 2, 3]
     */
    cameras?: number[]
}

     /**
     * id da empresa que o usuário faz parte
     *   1
     *  @IsNumber({}, {message: 'Empresa inválida'})
    companyId?: number

     */

