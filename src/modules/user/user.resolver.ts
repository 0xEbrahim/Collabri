import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { USER_ROLE, UserEntity } from './entities/user.entity';
import { QueryAllInputType } from 'src/common/input-types/query.inputs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Resolver(() => UserEntity)
@UseGuards(AuthGuard, RoleGuard)
@Roles(USER_ROLE.ADMIN)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [UserEntity], { name: 'users' })
  async getAllUsers(
    @Args('query', { nullable: true }) query?: QueryAllInputType,
  ) {
    const result = await this.userService.findAll(query);
    const users = result.data.users;
    return users;
  }

  @Query(() => UserEntity, { name: 'user' })
  async getUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => UserEntity)
  async createUser(@Args('createUser') createUser: CreateUserDto) {
    const { data } = await this.userService.create(createUser);
    const { user } = data;
    return user;
  }

  @Mutation(() => UserEntity)
  async updateUser(@Args('updateUser') updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Mutation(() => String)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
