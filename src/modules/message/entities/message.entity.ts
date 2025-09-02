import { RoomEntity } from 'src/modules/room/entities/room.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'messages' })
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  roomId: number;
  @Column()
  message: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => RoomEntity, (room) => room.messages)
  @JoinColumn({ name: 'roomId' })
  room: RoomEntity;

  @ManyToOne(() => UserEntity, user => user.messages)
  user: UserEntity
}
