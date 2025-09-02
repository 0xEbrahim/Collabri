import { MessageEntity } from 'src/modules/message/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoomMemberEntity } from './roomMembers.entity';

@Entity({ name: 'rooms' })
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250, nullable: true })
  name?: string;

  @Column({ type: 'boolean' })
  is_dm: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MessageEntity, (msg) => msg.room)
  messages: MessageEntity[];

  @OneToMany(() => RoomMemberEntity, (rm) => rm.room)
  participated: RoomMemberEntity[];
}
