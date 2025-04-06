import { Module } from '@nestjs/common';
import { ScrapeService } from './services/scrape.service';
import { TwoCaptchaModule } from 'src/two-captcha/two-captcha.module';
import { HttpModule } from "@nestjs/axios";
import { ScrapeDataAnmService } from './services/scrape-data-anm.service';

@Module({
    imports: [TwoCaptchaModule, HttpModule],
    controllers: [],
    providers: [ScrapeService, ScrapeDataAnmService],
    exports: [ScrapeService, ScrapeDataAnmService],
})
export class ScrapeProcessesModule { }
