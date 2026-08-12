import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ScrapeDataAnmService } from './infrastructure/services/scrape-processes/services/scrape-data-anm.service';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { Pagination } from 'prisma/helpers/pagination';
import { Prisma } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly scrapeDataAnmService: ScrapeDataAnmService, private readonly prisma: PrismaService, protected pagination: Pagination,) { }

  @Get()
  async getHello(): Promise<any> {
    return this.scrapeDataAnmService.handle()
  }

}
