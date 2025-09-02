import { IsNotEmpty, IsNumber } from 'class-validator';

export class JoinRoomDTO {
  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
