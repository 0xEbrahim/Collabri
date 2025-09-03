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
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SocketAuthMiddleware } from 'src/common/middlewares/ws.middleware';
import { JwtPayload } from 'src/common/types/types';
import { RoomService } from '../room/room.service';
import {
  CreateMessageDto,
  CreateMessageSocketDto,
} from './dto/create-message.dto';
import { MessageService } from './message.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DeleteMessageDTO } from './dto/delete-message.dto';
import { UpdateReadMessageDto } from './dto/read-message.dto';
import { AllExceptionsFilter } from 'src/common/filters/httpExceptions.filter';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@WebSocketGateway()
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionsFilter())
export class MessageGateway implements OnModuleInit, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRedis() private redis: Redis,
    private readonly socketAuthMW: SocketAuthMiddleware,
    private RoomService: RoomService,
    private MessageService: MessageService,
  ) {}

  onModuleInit() {
    // this.server.on('connection', (socket) => {
    //   console.log(`Client connected: ${socket.id}`);
    // });
  }
  afterInit(client: Socket) {
    client.use(this.socketAuthMW.use.bind(this.socketAuthMW));
  }

  @SubscribeMessage('initSocket')
  async onInitSocket(@ConnectedSocket() client: Socket) {
    const user: JwtPayload = client['User'];
    client.join(`${user.id}`);
    await this.redis.sadd(`rooms:${user.id}`, `${user.id}`);
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
      client.join(`${roomId}`);
    await this.redis.sadd(`rooms:${user.id}`, `${roomId}`);
      this.server
        .to(`${receiverId}`)
        .emit('dmRoomCreated', { roomId: roomId, senderId });
    }
    const room = await this.RoomService.findOne(roomId);
    const messages = await this.MessageService.getRoomMessages({}, room.id);
    this.server.to(`${receiverId}`).emit('dmOpened', { room, messages });
  }

  @SubscribeMessage('sendMessage')
  async oneSendMessage(
    @MessageBody() createMsgDto: CreateMessageSocketDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user: JwtPayload = client['User'];
    console.log(user);
    const createMsgBody: CreateMessageDto = {
      ...createMsgDto,
      userId: user.id,
    };
    const { message, roomId } = await this.MessageService.create(createMsgBody);
    this.server.to(`${roomId}`).emit('messageSent', message);
  }

  @SubscribeMessage('updateMessage')
  async onUpdateMessage(
    @MessageBody() data: UpdateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client['User'];
    data.userId = user.id;
    const message = await this.MessageService.update(data);
    this.server.to(`${data.roomId}`).emit('messageUpdated', { message });
  }

  @SubscribeMessage('deleteMessage')
  async onDeleteMessage(
    @MessageBody() data: DeleteMessageDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client['User'];
    data.userId = user.id;
    const message = await this.MessageService.remove(data);
    this.server.to(`${data.roomId}`).emit('messageDeleted', { message });
  }

  @SubscribeMessage('readMessage')
  async onReadMessage(
    @MessageBody() data: UpdateReadMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client['User'];
    data.userId = user.id;
    const message = await this.MessageService.updatedReadStatus(data);
    this.server.to(`${data.roomId}`).emit('messageRead', { message });
  }
}
