import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { register } from "module";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FoldersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: { name: string, userId: number }) {
        if (!data.name) {
            throw new BadRequestException('Nome da pasta é obrigatório')
        }

        const folder = await this.prisma.folders.create({
            data: {
                name: data.name,
                userId: data.userId,
            }
        })

        if (!folder) {
            throw new BadRequestException('Erro ao criar a pasta')
        }

        return {
            folder
        }
    }

    async findManyUser(userId: number, { name, page, perPage }: { name: string, page: number, perPage: number }) {
        const customerPrisma = this.prisma.paginationExtension()
        const [folders, pagination] = await customerPrisma.folders.paginate({
            where: {
                userId,
                name: name ? { contains: name, mode: 'insensitive' } : {}
            },
            select: {
                uuid: true,
                name: true,
                _count: {
                    select: {
                        MonitoredProcesses: true
                    }
                }
            },
        }).withPages({
            limit: perPage,
            page,
            includePageCount: true,
        })

        return {
            data: folders.map((f) => {
                const { name, uuid, _count } = f

                return {
                    name,
                    uuid,
                    totalMonitoredProcesses: _count.MonitoredProcesses
                }
            }),
            pagination
        }
    }

    async findFirst(uuid: string) {
        const folder = await this.prisma.folders.findFirst({
            where: {
                uuid
            }
        })

        if (!folder) {
            throw new NotFoundException('Pasta não encontrada')
        }

        return {
            folder
        }
    }

    async update(uuid: string, { name }: { name: string }) {
        await this.findFirst(uuid)
        const folder = await this.prisma.folders.update({
            where: {
                uuid
            },
            data: {
                name
            }
        })
        return {
            folder
        }
    }

    async remove(uuid: string) {
        const { folder } = await this.findFirst(uuid)
        await this.prisma.folders.delete({
            where: {
                uuid
            }
        })
        return {
            folder
        }
    }

    async findManyUserOptions(userId: number) {
        const options = await this.prisma.folders.findMany({
            where: {
                userId
            },
            select: {
                name: true,
                uuid: true
            }
        })

        return {
            options: options.map((op) => {
                const { name, uuid } = op
                return {
                    label: name,
                    value: uuid
                }
            })
        }
    }
}