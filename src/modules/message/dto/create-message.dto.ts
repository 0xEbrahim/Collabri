import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  roomId?: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  receiverId?: number;
}

export class CreateMessageSocketDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  roomId?: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  receiverId?: number;
}
