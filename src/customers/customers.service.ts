import { BadRequestException, Injectable } from "@nestjs/common";
import { Pagination } from "prisma/helpers/pagination";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCustomerBodySchema } from "./dto/create-customer.dto";

@Injectable()
export class CustomersService {
    constructor(private readonly prisma: PrismaService, private readonly pagination: Pagination) { }

    async create(createCustomerBodySchema: CreateCustomerBodySchema, companyId: number) {
        const { cnpj, cpf, email, name, surname, type } = createCustomerBodySchema

        const customer = await this.prisma.customer.create({
            data: {
                companyId,
                email, name, surname, type, cnpj, cpf,
            }
        })

        if (!customer) {
            throw new BadRequestException('Erro ao criar o cliente')
        }

        return {
            customer
        }
    }

}