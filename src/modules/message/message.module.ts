import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { JWTService } from '../auth/dto/Jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from '../auth/entity/token.entity';
import { SocketAuthMiddleware } from 'src/common/middlewares/ws.middleware';
import { RoomService } from '../room/room.service';
import { RoomEntity } from '../room/entities/room.entity';
import { MessageEntity } from './entities/message.entity';
import { RoomMemberEntity } from '../room/entities/roomMembers.entity';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([
      TokenEntity,
      RoomEntity,
      MessageEntity,
      RoomMemberEntity,
    ]),
  ],
  controllers: [MessageController],
  providers: [
    JWTService,
    MessageService,
    MessageGateway,
    SocketAuthMiddleware,
    RoomService,
  ],
})
export class MessageModule {}
