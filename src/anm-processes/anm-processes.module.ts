import { Module } from '@nestjs/common';
import { AnmProcessesController } from './anm-processes.controller';
import { AnmProcessesService } from './anm-processes.service';
import { ScrapeProcessesModule } from 'src/scrape-processes/scrape-processes.module';

@Module({
    imports: [ScrapeProcessesModule],
    controllers: [AnmProcessesController],
    providers: [AnmProcessesService]
})
export class AnmProcessesModule { }