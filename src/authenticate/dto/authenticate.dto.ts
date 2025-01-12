import { IsNotEmpty,  IsEmail } from "class-validator";

export class AuthenticateDto {
    /**
     * Email do usuário
     * @example joaosilva@email.com
     */

    @IsNotEmpty({
        message: 'Email é obrigatório'
    })
    @IsEmail()
    email: string

    /**
     * Senha do usuário
     * @example Ab@12345
     */
    @IsNotEmpty({
        message: 'Senha é obrigatório'
    })
    password: string
}
