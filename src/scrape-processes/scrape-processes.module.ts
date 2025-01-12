import { Module } from '@nestjs/common';
import { ScrapeService } from './services/scrape.service';
import { TwoCaptchaModule } from 'src/two-captcha/two-captcha.module';

@Module({
    imports: [TwoCaptchaModule],
    controllers: [],
    providers: [ScrapeService],
    exports: [ScrapeService],
})
export class ScrapeProcessesModule { }
