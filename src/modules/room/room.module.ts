import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { RoomMemberEntity } from './entities/roomMembers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, RoomMemberEntity])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
