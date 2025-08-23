import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ScrapeProcessesModule } from '../scrape-processes/scrape-processes.module';

@Module({
  imports: [ScrapeProcessesModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}