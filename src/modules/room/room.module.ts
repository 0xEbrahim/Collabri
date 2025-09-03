import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { RoomMemberEntity } from './entities/roomMembers.entity';
import { RoomGateway } from './room.gateway';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from '../auth/dto/Jwt.service';
import { SocketAuthMiddleware } from 'src/common/middlewares/ws.middleware';
import { TokenEntity } from '../auth/entity/token.entity';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([RoomEntity, RoomMemberEntity, TokenEntity]),
  ],
  controllers: [RoomController],
  providers: [JWTService, RoomService, RoomGateway, SocketAuthMiddleware],
})
export class RoomModule {}
