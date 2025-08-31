import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Job } from 'bullmq';

@QueueEventsListener('email')
export class EmailQueueEventListener extends QueueEventsHost {
  @OnQueueEvent('added')
  onAdded(job: Job) {
    console.log(`Job: ${job.name} is added to the queue`);
  }
}
