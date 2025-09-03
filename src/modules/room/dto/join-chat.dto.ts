import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class JoinChatRoomDTO {
  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  userId?: number;
}
