import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScrapeDataAnmService } from '../scrape-processes/services/scrape-data-anm.service';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(private readonly scrapeDataAnmService: ScrapeDataAnmService) { }


    @Cron('*/10 * * * * *', {
        name: 'atualizacaoCada10Segundos',
        timeZone: 'America/Sao_Paulo'
    })
    async executarAtualizacaoDiaria() {
       console.log('Chamou')

        /*  try {
           await this.scrapeDataAnmService.handle();
           this.logger.log('Atualização diária concluída com sucesso');
         } catch (error) {
           this.logger.error(`Erro na atualização diária: ${error.message}`, error.stack);
         } */
    }
}