import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailsService } from '../emails/emails.service';

@Processor('email')
export class EmailQueueProcessor {
  private readonly logger = new Logger(EmailQueueProcessor.name);

  constructor(private readonly emailsService: EmailsService) {}

  @Process('send-update-processes')
  async handleSendUpdateProcesses(job: Job) {
    this.logger.debug(`Processando job ${job.id} de tipo send-update-processes`);
    this.logger.debug(`Dados: ${JSON.stringify(job.data)}`);
    
    try {
      await this.emailsService.sendEmailUpdateProcesses(job.data);
      this.logger.log(`Email enviado com sucesso para ${job.data.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Erro ao enviar email: ${error.message}`, error.stack);
      throw error;
    }
  }
}