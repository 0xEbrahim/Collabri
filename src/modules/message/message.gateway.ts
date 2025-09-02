import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SocketAuthMiddleware } from 'src/common/middlewares/ws.middleware';
import { JwtPayload } from 'src/common/types/types';
import { RoomService } from '../room/room.service';

@WebSocketGateway()
@UseGuards(AuthGuard)
export class MessageGateway implements OnModuleInit, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketAuthMW: SocketAuthMiddleware,
    private RoomService: RoomService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
    });
  }
  afterInit(client: Socket) {
    client.use(this.socketAuthMW.use.bind(this.socketAuthMW));
  }

  @SubscribeMessage('initSocket')
  onInitSocket(@ConnectedSocket() client: Socket) {
    const user: JwtPayload = client['User'];
    client.join(`${user.id}`);
    console.log(`User joined his room: ${user.id}`);
  }

  @SubscribeMessage('joinRoom')
  onJoinRoom(@MessageBody() room: number, @ConnectedSocket() client: Socket) {
    const user: JwtPayload = client['User'];
    if (!this.RoomService.joinRoom({ roomId: room, userId: user.id })) {
      client.join(`${room}`);
    }
    this.server.emit('roomJoined', 'You joined the room');
  }

  @SubscribeMessage('openDm')
  async onOpenDm(
    @MessageBody() receiverId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const user: JwtPayload = client['User'];
    const senderId = user.id;
    const roomId = await this.RoomService.getDmRoom({
      receiverId: receiverId,
      senderId: senderId,
    });
    if (!client.rooms.has(`${roomId}`)) {
      this.server
        .to(`${receiverId}`)
        .emit('roomCreated', { roomId: roomId, senderId });
      client.join(`${roomId}`);
    }
    const room = await this.RoomService.findOne(roomId);
    this.server.emit('dmOpened', room);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
