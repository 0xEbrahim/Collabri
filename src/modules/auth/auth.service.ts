import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDTO } from './dto/signUp.dto';
import { dataSourceOptions } from 'src/db/data-source';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async register(signUpDTO: SignUpDTO) {
    let user = await this.userRepository.findOneBy({
      email: signUpDTO.email,
    });
    if (user) throw new ConflictException('Email already exists.');
    user = this.userRepository.create(signUpDTO);
    user = await this.userRepository.save(user);
    
    return user;
  }
}
