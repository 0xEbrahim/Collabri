import crypto from 'crypto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { SignUpDTO } from './dto/signUp.dto';
import { ConfigService } from '@nestjs/config';
import {
  IEmail,
  IResponse,
  JwtPayload,
  PassportUser,
} from 'src/common/types/types';
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

  private async _sendVerifyEmail(user: UserEntity): Promise<UserEntity> {
    const code = crypto.randomBytes(32).toString('hex');
    const encoded = crypto.createHash('sha256').update(code).digest('hex');
    user.emailVerificationToken = encoded;
    user.emailVerificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const emailData: IEmail = {
      from: this.cfg.get<string>('APP_MASTER_USER')!,
      to: user.email,
      data: {
        username: user.name,
        verificationUrl: `${this.cfg.get<string>('APP_BASE_URL')}/auth/verifyEmail/${code}`,
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
    return user;
  }

  async register(signUpDTO: SignUpDTO) {
    let user = await this.userRepository.findOneBy({
      email: signUpDTO.email,
    });
    if (user) throw new ConflictException('Email already exists.');
    user = this.userRepository.create(signUpDTO);
    user.password = await this.bcrypt.hash(user.password);
    user = await this._sendVerifyEmail(user);
    user = await this.userRepository.save(user);
    const response: IResponse = {
      statusCode: 201,
      message:
        'Account created successfully, You received an email to verify you account please check your account.',
    };
    return response;
  }

  async login({ email, password }: LoginDTO) {
    let user = await this.userRepository.findOneBy({ email: email });
    if (!user || !(await this.bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.emailverified) {
      user = await this._sendVerifyEmail(user);
      await this.userRepository.save(user);
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
    return { token, refreshToken };
  }

  async refresh(token: string) {
    let payload: JwtPayload = await this.jwt.verifyRefreshToken(token);
    const user = await this.userRepository.findOneBy({ id: payload.id });
    if (!user)
      throw new UnauthorizedException('Invalid or expired refresh token');
    payload = {
      id: user.id,
      role: user.role,
    };
    const ac_token = await this.jwt.generateAccessToken(payload);
    return { token: ac_token };
  }

  async verifyEmail(code: string) {
    const encoded = crypto.createHash('sha256').update(code).digest('hex');
    let user = await this.userRepository.findOneBy({
      emailVerificationToken: encoded,
      emailVerificationTokenExpiry: MoreThan(new Date(Date.now())),
    });
    if (!user) {
      throw new BadRequestException('Invalid or expired verification link');
    }
    await this.userRepository.update(
      { id: user.id },
      {
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null,
        emailverified: true,
      },
    );
    return {
      message:
        'Email verified successfully, You can login to your account now.',
    };
  }

  async handleGoogleOAuth({ email, id, avatar, name, provider }: PassportUser) {
    let user = await this.userRepository.findOneBy({
      provider: provider,
      providerId: id,
    });
    if (!user) {
      user = this.userRepository.create({
        avatar,
        email,
        name,
        provider,
        providerId: id,
        emailverified: true,
        password: crypto.randomBytes(32).toString('hex'),
      });
      user.password = await this.bcrypt.hash(user.password);
      await this.userRepository.save(user);
    }
    const payload: JwtPayload = {
      id: user.id,
      role: user.role,
    };
    const token = await this.jwt.generateAccessToken(payload);
    const refreshToken = await this.jwt.generateRefreshToken(payload);
    return { token, refreshToken };
  }
}
