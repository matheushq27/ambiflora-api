import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailsModule } from '../emails/emails.module';
import { EmailQueueProcessor } from './email-queue.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
    EmailsModule,
  ],
  providers: [EmailQueueProcessor],
  exports: [BullModule],
})
export class EmailQueueModule {}