import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class QueryAllInputType {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @Field(() => Int, { nullable: true })
  limit?: number;
}
