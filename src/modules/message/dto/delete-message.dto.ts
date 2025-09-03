import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DeleteMessageDTO {
  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  @IsNumber()
  @IsNotEmpty()
  messageId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  userId?: number;
}
