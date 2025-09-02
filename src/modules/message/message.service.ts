import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private MessageEntity: Repository<MessageEntity>,
    @InjectRepository(RoomEntity) private RoomEntity: Repository<RoomEntity>,
    @InjectRepository(RoomMemberEntity)
    private RoomMembers: Repository<RoomMemberEntity>,
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
    return { message, roomId: roomId };
  }

  findAll() {
    return `This action returns all message`;
  }

  async getRoomMessages(q: QueryAllInputType, id: number) {
    q.page = q.page ?? 1;
    q.limit = q.limit ?? 100;
    const messages = await this.MessageEntity.find({
      where: { roomId: id },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    });
    return messages;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
