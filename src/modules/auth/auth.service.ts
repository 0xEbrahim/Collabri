import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDTO } from './dto/signUp.dto';
import { ConfigService } from '@nestjs/config';
import { IEmail, IResponse } from 'src/common/types/types';
import path from 'path';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BcryptService } from './bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectQueue('email') private emailQueue: Queue,
    private bcrypt: BcryptService,
    private cfg: ConfigService,
  ) {}

  async register(signUpDTO: SignUpDTO) {
    let user = await this.userRepository.findOneBy({
      email: signUpDTO.email,
    });
    if (user) throw new ConflictException('Email already exists.');
    user = this.userRepository.create(signUpDTO);
    console.log('111');
    user.password = await this.bcrypt.hash(user.password);
    user = await this.userRepository.save(user);
    const emailData: IEmail = {
      from: this.cfg.get<string>('APP_MASTER_USER')!,
      to: user.email,
      data: {
        username: user.name,
        verificationUrl: `${this.cfg.get<string>('APP_BASE_URL')}/auth/verifyEmail`,
      },
      template: path.join(__dirname, '../../templates/email.verify.ejs'),
      subject: 'Email verification',
    };
    await this.emailQueue.add('EmailJob', emailData, {
      attempts: 10,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
    const response: IResponse = {
      statusCode: 201,
      message:
        'Account created successfully, You received an email to verify you account please check your account.',
    };
    return response;
  }
}
