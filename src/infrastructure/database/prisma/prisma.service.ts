import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { pagination } from "prisma-extension-pagination";

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    //private pages
    constructor() {
        super({
            log: ['warn', 'error']
        })

        console.log('PrismaService instance created');
    }

    async onModuleInit() {
        return await this.$connect()
    }

    async onModuleDestroy() {
        return await this.$disconnect()
    }

    paginationExtension() {
        return this.$extends(pagination());
    }
}