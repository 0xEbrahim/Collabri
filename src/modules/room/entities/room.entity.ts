import { MessageEntity } from 'src/modules/message/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoomMemberEntity } from './roomMembers.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'rooms' })
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250, nullable: true })
  name?: string;

  @Column({ type: 'varchar', nullable: true })
  userId?: number;

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

  @ManyToOne(() => UserEntity, (usr) => usr.rooms)
  admin?: UserEntity;
}
