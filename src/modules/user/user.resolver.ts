import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { USER_ROLE, UserEntity } from './entities/user.entity';
import { QueryAllInputType } from 'src/common/input-types/query.inputs';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

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
