import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from 'src/modules/email/email.service';

@Processor('email', { concurrency: 5 })
export class EmailQueueProcessor extends WorkerHost {
  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    await this.emailService.sendEmail(job.data);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Job: ${job.name} - ID: ${job.id} is active now`);
  }

  @OnWorkerEvent('completed')
  onComplete(job: Job) {
    console.log(`Job: ${job.name} - ID: ${job.id} is completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(`Job: ${job.name} - ID: ${job.id} failed`);
    console.log(`Attempts number : ${job.attemptsMade}`);
  }
}
