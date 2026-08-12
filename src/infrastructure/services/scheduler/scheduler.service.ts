import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScrapeDataAnmService } from '../scrape-processes/services/scrape-data-anm.service';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(private readonly scrapeDataAnmService: ScrapeDataAnmService) { }


    @Cron('0 4 * * *', {
        name: 'atualizacaoDiariaAnm',
        timeZone: 'America/Sao_Paulo'
    })
    async executarAtualizacaoDiaria() {
         try {
           console.log('Iniciando rotina de atualização da ANM (04:00 AM)...');
           await this.scrapeDataAnmService.handle();
           this.logger.log('Atualização diária concluída com sucesso');
         } catch (error) {
           this.logger.error(`Erro na atualização diária: ${error.message}`, error.stack);
         }
    }
}