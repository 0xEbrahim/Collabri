import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class LeaveChatRoomDTO {
  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  userId?: number;
}
