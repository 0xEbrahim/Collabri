import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDTO } from './dto/signUp.dto';
import { ConfigService } from '@nestjs/config';
import { IEmail, IResponse, JwtPayload } from 'src/common/types/types';
import path from 'path';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BcryptService } from './bcrypt.service';
import { LoginDTO } from './dto/login.dto';
import { JWTService } from './dto/Jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectQueue('email') private emailQueue: Queue,
    private bcrypt: BcryptService,
    private cfg: ConfigService,
    private jwt: JWTService,
  ) {}

  private async _sendVerifyEmail(user: UserEntity) {
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
  }

  async register(signUpDTO: SignUpDTO) {
    let user = await this.userRepository.findOneBy({
      email: signUpDTO.email,
    });
    if (user) throw new ConflictException('Email already exists.');
    user = this.userRepository.create(signUpDTO);
    console.log('111');
    user.password = await this.bcrypt.hash(user.password);
    user = await this.userRepository.save(user);
    await this._sendVerifyEmail(user);
    const response: IResponse = {
      statusCode: 201,
      message:
        'Account created successfully, You received an email to verify you account please check your account.',
    };
    return response;
  }

  async login({ email, password }: LoginDTO) {
    const user = await this.userRepository.findOneBy({ email: email });
    if (!user || !(await this.bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.emailverified) {
      await this._sendVerifyEmail(user);
      throw new ForbiddenException(
        'Email not verified. Please check your inbox to verify your account.',
      );
    }
    const payload: JwtPayload = {
      id: user.id,
      role: user.role,
    };
    const token = await this.jwt.generateAccessToken(payload);
    const refreshToken = await this.jwt.generateRefreshToken(payload);
    return { data: { user }, token, refreshToken };
  }
}
