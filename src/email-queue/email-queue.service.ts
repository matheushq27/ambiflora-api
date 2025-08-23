import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

interface SendEmailUpdateProcessesParams {
  to: string;
  user: {
    name: string;
  };
  processes: {
    name: string;
    numberYear: string;
    lastPhase: string;
    currentPhase: string;
  }[];
}

@Injectable()
export class EmailQueueService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async addUpdateProcessesJob(data: SendEmailUpdateProcessesParams) {
    return this.emailQueue.add('send-update-processes', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000, // 1 segundo inicial
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}