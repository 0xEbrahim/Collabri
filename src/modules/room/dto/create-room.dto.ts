import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  userId?: number;
}
