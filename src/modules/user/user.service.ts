import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryAllInputType } from 'src/common/input-types/query.inputs';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from '../auth/bcrypt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private UserRepository: Repository<UserEntity>,
    private bcrypt: BcryptService,
  ) {}

  async create(createUser: CreateUserDto) {
    let user = this.UserRepository.create({
      ...createUser,
      emailverified: true,
    });
    user.password = await this.bcrypt.hash(user.password);
    user = await this.UserRepository.save(user);
    return { data: { user } };
  }

  async getProfile(userId: number) {
    const user = await this.UserRepository.findOneBy({ id: +userId });
    return { data: { user } };
  }

  async findAll(q?: QueryAllInputType) {
    const page = q?.page ? q.page : 1;
    const limit = q?.limit ? q.limit : 50;
    const skip = (page - 1) * limit;
    const users = await this.UserRepository.find({ skip: skip, take: limit });
    return { data: { users } };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
