import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { RoomMemberEntity } from './entities/roomMembers.entity';
import { RoomGateway } from './room.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, RoomMemberEntity])],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
})
export class RoomModule {}
