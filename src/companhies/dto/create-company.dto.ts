import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
    @ApiProperty({
        description: 'Nome da empresa',
        example: 'Empresa'
    })

    @IsNotEmpty({
        message: 'Nome da empresa não pode ser vazio'
    })
    @IsString({
        message: 'Nome da empresa precisa ser uma string'
    })
    name: string

    @ApiProperty({
        description: 'País',
        example: 'Brasil'
    })

    @IsNotEmpty({
        message: 'É obrigatório inserir um país'
    })
    @IsString()
    country: string

    @ApiProperty({
        description: 'Cidade',
        example: 'Cuiabá'
    })
    @IsString()
    city: string

    @ApiProperty({
        description: 'Estado',
        example: 'MT'
    })

    @IsString()
    state: string

    @ApiProperty({
        description: 'Rua',
        example: 'Rua dos Bobos'
    })

    @IsString()
    street: string

    @ApiProperty({
        description: 'CEP',
        example: '78090030'
    })

    @IsInt({
        message: 'CEP precisa ser um número'
    })
    postalCode: number

    @ApiProperty({
        description: 'Número',
        example: '10'
    })

    @IsInt({
        message: 'Número inválido'
    })
    locationNumber: number
}
