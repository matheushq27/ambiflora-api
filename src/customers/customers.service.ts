import { BadRequestException, Injectable } from "@nestjs/common";
import { Pagination } from "prisma/helpers/pagination";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCustomerBodySchema } from "./dto/create-customer.dto";
import { paginate, pagination } from "prisma-extension-pagination";

@Injectable()
export class CustomersService {

    private select = {
        id: true,
        name: true,
        surname: true,
        email: true,
        cnpj: true,
        cpf: true,
        type: true,
        companyId: true,
    }

    constructor(private readonly prisma: PrismaService, private readonly pagination: Pagination) {

    }

    async create(createCustomerBodySchema: CreateCustomerBodySchema, companyId: number) {
        const { cnpj, cpf, email, name, surname, type } = createCustomerBodySchema

        let cpfFormatted = cpf
        let cnpjFormatted = cnpj

        if (cpf) {
            cpfFormatted = cpf.replace(/\D/g, '')
        }

        if (cnpj) {
            cnpjFormatted = cnpj.replace(/\D/g, '')
        }

        await this.checkExist({ cnpj: cnpjFormatted, companyId, cpf: cpfFormatted, email })

        const customer = await this.prisma.customer.create({
            data: {
                companyId,
                email, name, surname, type, cnpj: cnpjFormatted, cpf: cpfFormatted,
            },
            select: this.select
        })

        if (!customer) {
            throw new BadRequestException('Erro ao criar o cliente')
        }

        return {
            customer
        }
    }

    async update(customerId: number, updateCustomerBodySchema: CreateCustomerBodySchema) {
        const { cnpj, cpf, email, name, surname, type } = updateCustomerBodySchema

        await this.checkExistById(customerId)

        const customerUpdate = await this.prisma.customer.update({
            where: {
                id: customerId
            },
            data: {
                cnpj,
                cpf,
                email,
                name,
                surname,
                type
            }
        })

        return {
            customer: customerUpdate
        }
    }

    async findMany(companyId: number, { page, perPage }: { page: number, perPage: number }) {

        const customerPrisma = this.prisma.paginationExtension()
        const [customers, pagination] = await customerPrisma.customer.paginate({
            where: {
                companyId
            },
            select: this.select,
        }).withPages({
            limit: perPage,
            page,
            includePageCount: true,
        })

        return {
            data: customers,
            pagination
        }
    }

    async delete(id: number) {

        await this.checkExistById(id)

        return await this.prisma.customer.delete({
            where: {
                id
            }
        })
    }

    async deleteMany(arrayId: number[]) {

        return await this.prisma.customer.deleteMany({
            where: {
                id: {
                    in: arrayId
                }
            }
        })
    }

    async checkExistById(id: number) {
        const exist = await this.prisma.customer.findFirst({
            where: {
                id
            }
        })

        if (!exist) {
            throw new BadRequestException('Cliente não encontrado')
        }
    }

    async checkExist({ email, cnpj, companyId, cpf }: { email: string, cpf: string, cnpj: string, companyId: number }) {
        const existEmail = await this.prisma.customer.findFirst({
            where: {
                email,
                companyId
            }
        })

        if (existEmail) {
            throw new BadRequestException('Já existe um cliente cadastrado com esse email')
        }

        if (cnpj) {
            const existCnpj = await this.prisma.customer.findFirst({
                where: {
                    cnpj,
                    companyId
                }
            })

            if (existCnpj) {
                throw new BadRequestException('Já existe um cliente cadastrado com esse CNPJ')
            }
        }

        if (cpf) {
            const existCpf = await this.prisma.customer.findFirst({
                where: {
                    cpf,
                    companyId
                }
            })

            if (existCpf) {
                throw new BadRequestException('Já existe um cliente cadastrado com esse CPF')
            }
        }

    }

}