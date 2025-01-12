import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailsService } from './emails.service';
import * as path from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true, // use STARTTLS
        auth: {
          user: 'processos.minerarios@ambiflora.com.br',
          pass: '7hUa+EaPu$',
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: '"Ambiflora" <processos.minerarios@ambiflora.com.br>',
      },
      template: {
        dir: path.join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule { }



