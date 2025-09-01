import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { QueryAllInputType } from 'src/common/input-types/query.inputs';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [UserEntity])
  async users(@Args('query', { nullable: true }) query?: QueryAllInputType) {
    const result = await this.userService.findAll(query);
    const users = result.data.users;
    return users;
  }

  @Mutation(() => UserEntity)
  async createUser(@Args('createUser') createUser: CreateUserDto) {
    const { data } = await this.userService.create(createUser);
    const { user } = data;
    return user;
  }
}
