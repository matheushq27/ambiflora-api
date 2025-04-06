import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ScrapeDataAnmService } from './scrape-processes/services/scrape-data-anm.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly scrapeDataAnmService: ScrapeDataAnmService) { }

  @Get()
  async getHello(): Promise<any> {
    return await this.scrapeDataAnmService.handle()
  }
}
