import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserDto {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;
}
