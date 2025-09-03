import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  messageId: number;

  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  userId?: number;
}
