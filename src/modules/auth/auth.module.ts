import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { BullModule } from '@nestjs/bullmq';
import { EmailService } from '../email/email.service';
import { EmailQueueEventListener } from 'src/queue/email/email-queue.events';
import { EmailQueueProcessor } from 'src/queue/email/email.worker';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    BullModule.registerQueue({ name: 'email' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    EmailQueueEventListener,
    EmailQueueProcessor,
  ],
})
export class AuthModule {}
