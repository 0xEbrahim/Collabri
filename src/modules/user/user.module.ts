import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from '../auth/dto/Jwt.service';
import { UserResolver } from './user.resolver';
import { BcryptService } from '../auth/bcrypt.service';
import { TokenEntity } from '../auth/entity/token.entity';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([UserEntity, TokenEntity])],
  controllers: [UserController],
  providers: [UserService, JWTService, UserResolver, BcryptService],
})
export class UserModule {}
