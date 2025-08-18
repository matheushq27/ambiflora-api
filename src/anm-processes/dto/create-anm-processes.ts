import { z } from "zod";
import { ApiProperty } from '@nestjs/swagger';

export const createMonitorBodySchema = z.object({
    processNumber: z.string({required_error: 'Número do projeto não foi encontrado'}),
    folderId: z.string({required_error: 'Pasta não encontrada'}),
})


export type CreateMonitorBodySchema = Required<z.infer<typeof createMonitorBodySchema>>


export const notMonitorBodySchema = z.object({
    processNumber: z.string({required_error: 'Número do projeto não foi encontrado'})
})


export type NotMonitorBodySchema = Required<z.infer<typeof notMonitorBodySchema>>

export const monitorMultipleBodySchema = z.object({
    processNumbers: z.string({required_error: 'Projetos não encontrados'}).array(),
    folderId: z.string({required_error: 'Pasta não encontrada'}),
})

export type MonitorMultipleBodySchema = Required<z.infer<typeof monitorMultipleBodySchema>>

export class CreateMonitorDto {
    @ApiProperty({ example: "851.381/2020", description: "Número do processo" })
    processNumber: string;

    @ApiProperty({ example: 1, description: "ID da pasta que ficará o projeto" })
    folderId: string;
}

export class NotMonitorDto {
    @ApiProperty({ example: "851.381/2020", description: "Número do processo" })
    processNumber: string;
}

export class MonitorMultipleDto {
    @ApiProperty({ example: ["851.381/2020"], description: "Array de Números de processo" })
    processNumber: string[];

    @ApiProperty({ example: 1, description: "ID da pasta que ficará o projeto" })
    folderId: string;
}


