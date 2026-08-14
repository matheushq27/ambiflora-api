import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ScrapeDataAnmService } from './infrastructure/services/scrape-processes/services/scrape-data-anm.service';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { Pagination } from 'prisma/helpers/pagination';
import { JwtAuthGuard } from './infrastructure/auth/auth/jwt-auth.guard';
import { UserCacheService } from './application/services/user-cache.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private readonly scrapeDataAnmService: ScrapeDataAnmService, 
    private readonly prisma: PrismaService, 
    protected pagination: Pagination,
    private readonly userCacheService: UserCacheService
  ) { }

  @Get()
  async getHello(): Promise<any> {
    return this.scrapeDataAnmService.handle()
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe() {
    const data = await this.userCacheService.getUserData();
    return { data };
  }
}
