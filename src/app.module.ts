import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { ScrapeProcessesModule } from './infrastructure/services/scrape-processes/scrape-processes.module';
import { TwoCaptchaModule } from './infrastructure/services/two-captcha/two-captcha.module';
import { AuthModule } from './infrastructure/auth/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './common/env';
import { UsersModule } from './infrastructure/modules/users.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { CompaniesModule } from './infrastructure/modules/companies.module';
import { AuthenticateModule } from './infrastructure/auth/authenticate/authenticate.module';
import { EmailsModule } from './infrastructure/notifications/emails/emails.module';
import { CustomersModule } from './infrastructure/modules/customers.module';
import { AnmProcessesModule } from './infrastructure/services/anm-processes/anm-processes.module';
import { FoldersModule } from './infrastructure/modules/folders.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './infrastructure/services/scheduler/scheduler.module';
import { BullModule } from '@nestjs/bull';
import { EmailQueueModule } from './infrastructure/notifications/email-queue/email-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: process.env.REDIS_URL,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    CompaniesModule,
    PrismaModule,
    AuthenticateModule, 
    ScrapeProcessesModule,
    EmailsModule,
    CustomersModule,
    AnmProcessesModule,
    FoldersModule,
    SchedulerModule,
    EmailQueueModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
