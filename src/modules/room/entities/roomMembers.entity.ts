import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoomEntity } from './room.entity';

@Entity({ name: 'roomMembers' })
@Index(['userId', 'roomId'])
export class RoomMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  roomId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.participated)
  user: UserEntity;

  @ManyToOne(() => RoomEntity, (room) => room.participated)
  room: RoomEntity;
}
