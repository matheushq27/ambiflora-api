import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';

interface SendEmailUpdateProcessesParams {
  to: string
  user: {
    name: string
  }
  processes: {
    name: string
    numberYear: string
    lastPhase: string
    currentPhase: string
  }[]
}

@Injectable()
export class EmailsService {
  constructor(private readonly mailerService: MailerService) { }
  async sendEmailUpdateProcesses(params: SendEmailUpdateProcessesParams) {
    const { to, user, processes } = params
    await this.mailerService.sendMail({
      to,
      subject: 'Teste',
      template: './update-processes',
      context: {
        user,
        processes,
      },
    });
  }
}
