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
import {
  CreateMessageDto,
  CreateMessageSocketDto,
} from './dto/create-message.dto';
import { MessageService } from './message.service';

@WebSocketGateway()
@UseGuards(AuthGuard)
export class MessageGateway implements OnModuleInit, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketAuthMW: SocketAuthMiddleware,
    private RoomService: RoomService,
    private MessageService: MessageService,
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
        .emit('dmRoomCreated', { roomId: roomId, senderId });
      client.join(`${roomId}`);
      console.log(`Client[${user.id}] Joined Room[${roomId}]`);
    }
    const room = await this.RoomService.findOne(roomId);
    const messages = await this.MessageService.getRoomMessages({}, room.id);
    this.server.emit('dmOpened', { room, messages });
  }

  @SubscribeMessage('sendMessage')
  async oneSendMessage(
    @MessageBody() createMsgDto: CreateMessageSocketDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user: JwtPayload = client['User'];
    const createMsgBody: CreateMessageDto = {
      ...createMsgDto,
      userId: user.id,
    };
    const { message, roomId } = await this.MessageService.create(createMsgBody);
    this.server.to(`${roomId}`).emit('messageSent', message);
  }
}
