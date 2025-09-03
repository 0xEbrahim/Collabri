import { OnModuleInit, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthMiddleware } from 'src/common/middlewares/ws.middleware';
import { RoomService } from './room.service';
import { JwtPayload } from 'src/common/types/types';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinChatRoomDTO } from './dto/join-chat.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@WebSocketGateway()
@UseGuards(AuthGuard)
export class RoomGateway implements OnModuleInit, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private socketAuthMW: SocketAuthMiddleware,
    private RoomService: RoomService,
  ) {}

  onModuleInit() {
    this.server.use(this.socketAuthMW.use.bind(this.socketAuthMW));
    this.server.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
    });
  }

  afterInit(client: Socket) {
    client.use(this.socketAuthMW.use.bind(this.socketAuthMW));
  }

  @SubscribeMessage('joinDmRoom')
  async onJoinRoom(
    @MessageBody() room: number,
    @ConnectedSocket() client: Socket,
  ) {
    const user: JwtPayload = client['User'];
    if (
      !(await this.RoomService.joinDmRoom({ roomId: room, userId: user.id }))
    ) {
      client.join(`${room}`);
      this.server
        .to(`${room}`)
        .emit('newMember', { message: 'A new member joined' });
      console.log(`Client[${user.id}] Joined Room[${room}]`);
      this.server.emit('dmRoomJoined', 'You joined the room');
    }
  }

  @SubscribeMessage('createChatRoom')
  async onCreateChatRoom(
    @MessageBody() data: CreateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client['User'];
    console.log(user);
    data.userId = user.id;
    const room = await this.RoomService.create(data);
    this.server.emit('chatRoomCreated', { room, message: 'Room created' });
    /**
     Front-End receives this and call joinChatRoom
     */
  }

  @SubscribeMessage('joinChatRoom')
  async onJoinChatRoom(
    @MessageBody() data: JoinChatRoomDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client['User'];
    console.log(user);
    data.userId = user.id;
    if (!(await this.RoomService.joinChatRoom(data))) {
      client.join(`${data.roomId}`);
      client.join(`${data.roomId}`);
      this.server
        .to(`${data.roomId}`)
        .emit('newMember', { message: 'A new member joined' });
      console.log(`Client[${user.id}] joiend Room[${data.roomId}]`);
      this.server.emit('chatRoomJoined', 'You joined the room');
    }
  }
}
