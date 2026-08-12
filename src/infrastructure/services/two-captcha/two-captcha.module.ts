import { Module } from '@nestjs/common';
import { TwoCaptchaService } from './services/two-captcha.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [TwoCaptchaService],
    exports: [TwoCaptchaService]
})
export class TwoCaptchaModule { }
