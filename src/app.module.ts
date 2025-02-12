import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ScrapeProcessesModule } from './scrape-processes/scrape-processes.module';
import { TwoCaptchaModule } from './two-captcha/two-captcha.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompaniesModule } from './companhies/companies.module';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { EmailsModule } from './emails/emails.module';
import { CustomersModule } from './customers/customers.module';
import { AnmProcessesModule } from './anm-processes/anm-processes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    CompaniesModule,
    PrismaModule,
    AuthenticateModule, 
    ScrapeProcessesModule,
    EmailsModule,
    CustomersModule,
    AnmProcessesModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
