import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
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
@ObjectType()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  userId: number;

  @Column()
  @Field(() => Int)
  roomId: number;

  @Column()
  @Field(() => String)
  message: string;

  @Column({ default: false })
  @Field(() => Boolean, { nullable: true })
  read: boolean;

  @Column({ default: false })
  @Field(() => Boolean, { nullable: true })
  deleted: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => RoomEntity, (room) => room.messages)
  @JoinColumn({ name: 'roomId' })
  room: RoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  user: UserEntity;
}
