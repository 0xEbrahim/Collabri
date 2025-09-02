import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { GetDmRoomDTO } from './dto/getDmRoom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { RoomMemberEntity } from './entities/roomMembers.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity) private RoomEntity: Repository<RoomEntity>,
    @InjectRepository(RoomMemberEntity)
    private RoomMembers: Repository<RoomMemberEntity>,
    private dataSource: DataSource,
  ) {}

  create(createRoomDto: CreateRoomDto) {
    return 'This action adds a new room';
  }

  findAll() {
    return `This action returns all room`;
  }

  async getDmRoom({ receiverId, senderId }: GetDmRoomDTO) {
    const query = `SELECT rm1."roomId" as roomId
FROM "roomMembers" rm1
RIGHT JOIN "roomMembers" rm2
ON rm1."roomId"=rm2."roomId"
JOIN "rooms" r
ON r.id=rm1.id
WHERE r.is_dm=true AND rm1."userId"=$1 AND rm2."userId"=$2
`;
    let room: any = await this.dataSource.query(query, [receiverId, senderId]);
    if (!room || room.length == 0) {
      room = this.RoomEntity.create({ is_dm: true });
      room = await this.RoomEntity.save(room);
      let roomMemeber = this.RoomMembers.create({
        roomId: room.id,
        userId: senderId,
      });
      await this.RoomMembers.save(roomMemeber);
      roomMemeber = this.RoomMembers.create({
        roomId: room.id,
        userId: receiverId,
      });
      await this.RoomMembers.save(roomMemeber);
      room = [{ roomId: room.id }];
    }
    room = room[0].roomid;
    return room;
  }

  async findOne(id: number) {
    const room = await this.RoomEntity.findOne({
      where: { id: id },
      relations: { messages: true },
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
