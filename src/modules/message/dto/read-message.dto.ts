import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateReadMessageDto {
  @IsNumber()
  @IsNotEmpty()
  messageId: number;

  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  userId?: number;
}
