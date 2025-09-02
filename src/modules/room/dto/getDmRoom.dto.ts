import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetDmRoomDTO {
  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}
