import { z } from "zod";
import { ApiProperty } from '@nestjs/swagger';

export const createCustomerBodySchema = z.object({
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    type: z.enum(['NATURAL_PERSON', 'CORPORATE_ENTITY']).optional(),
}).refine(data => data.cpf || data.cnpj, {
    message: "CPF ou CNPJ devem ser informados",
    path: ["cpf", "cnpj"]
})

export type CreateCustomerBodySchema = z.infer<typeof createCustomerBodySchema>;


export class CreateCustomerDto {
    @ApiProperty({ example: "João", description: "Nome do cliente" })
    name: string;

    @ApiProperty({ example: "Silva", description: "Sobrenome do cliente" })
    surname: string;

    @ApiProperty({ example: "joao@email.com", description: "E-mail do cliente" })
    email: string;

    @ApiProperty({ example: "75663115064", description: "CPF do cliente", required: false })
    cpf?: string;

    @ApiProperty({ example: "46115401000198", description: "CNPJ do cliente", required: false })
    cnpj?: string;

    @ApiProperty({
        example: "NATURAL_PERSON",
        description: "Tipo de cliente (Pessoa Física ou Jurídica)",
        enum: ["NATURAL_PERSON", "CORPORATE_ENTITY"],
        required: false
    })
    type?: 'NATURAL_PERSON' | 'CORPORATE_ENTITY';
}


