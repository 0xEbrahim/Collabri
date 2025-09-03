import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Repository } from 'typeorm';
import { QueryAllInputType } from 'src/common/input-types/query.inputs';
import { RoomMemberEntity } from '../room/entities/roomMembers.entity';
import { RoomEntity } from '../room/entities/room.entity';
import { RoomService } from '../room/room.service';
import { DeleteMessageDTO } from './dto/delete-message.dto';
import { UpdateReadMessageDto } from './dto/read-message.dto';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from '../pubsub/pubsub.module';
import { SUB_EVENTS } from 'src/common/types/enums';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private MessageEntity: Repository<MessageEntity>,
    @InjectRepository(RoomEntity) private RoomEntity: Repository<RoomEntity>,
    @InjectRepository(RoomMemberEntity)
    private RoomMembers: Repository<RoomMemberEntity>,
    @Inject(PUB_SUB) private PubSub: RedisPubSub,
    private RoomService: RoomService,
  ) {}

  async create({
    message: msg,
    userId,
    receiverId,
    roomId,
  }: CreateMessageDto): Promise<{ roomId: number; message: MessageEntity }> {
    if (receiverId) {
      roomId = await this.RoomService.getDmRoom({
        receiverId,
        senderId: userId,
      });
    }
    if (!roomId) {
      throw new BadRequestException('You need to provide the room.');
    }
    const isMember = await this.RoomMembers.find({
      where: { roomId, userId },
    });
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this room');
    }
    let message = this.MessageEntity.create({
      message: msg,
      roomId,
      userId: userId,
    });
    message = await this.MessageEntity.save(message);
    this.PubSub.publish(`${SUB_EVENTS.NEW_MSG}:${roomId}`, {
      messageAdded: message,
    });
    return { message, roomId: roomId };
  }

  newMessage(roomID: number) {
    return this.PubSub.asyncIterableIterator(`${SUB_EVENTS.NEW_MSG}:${roomID}`);
  }

  async findAll() {
    return await this.MessageEntity.find();
  }

  async getRoomMessages(q: QueryAllInputType, id: number) {
    q.page = q.page ?? 1;
    q.limit = q.limit ?? 100;
    const messages = await this.MessageEntity.find({
      where: { roomId: id, deleted: false },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    });
    return messages;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  async update({ message, userId, messageId, roomId }: UpdateMessageDto) {
    let msg = await this.MessageEntity.findOne({
      where: { id: messageId, userId: userId, roomId: roomId, deleted: false },
    });
    if (!msg) throw new NotFoundException('Message not found');
    msg.message = message;
    msg = await this.MessageEntity.save(msg);
    return msg;
  }

  async updatedReadStatus({ messageId, roomId }: UpdateReadMessageDto) {
    let msg = await this.MessageEntity.findOne({
      where: { id: messageId, roomId: roomId },
    });
    if (!msg) throw new NotFoundException('Message not found');
    msg.read = true;
    msg = await this.MessageEntity.save(msg);
    return msg;
  }

  async remove({ messageId, roomId, userId }: DeleteMessageDTO) {
    let msg = await this.MessageEntity.findOne({
      where: { id: messageId, userId: userId, roomId: roomId },
    });
    if (!msg) throw new NotFoundException('Message not found');
    msg.deleted = true;
    msg.message = 'This message was deleted';
    msg = await this.MessageEntity.save(msg);
    return msg;
  }
}
