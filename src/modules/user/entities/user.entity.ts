import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { MessageEntity } from 'src/modules/message/entities/message.entity';
import { RoomMemberEntity } from 'src/modules/room/entities/roomMembers.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum USER_ROLE {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
@Index(['provider', 'providerId'])
@ObjectType()
export class UserEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  provider?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true, unique: true })
  providerId?: string | null;

  @Field()
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Field()
  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Field()
  @Column({ type: 'varchar', length: 150 })
  password: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  emailVerificationToken?: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  emailVerificationTokenExpiry?: Date | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  passwordResetToken?: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  passwordResetTokenExpiry?: Date | null;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  emailverified: boolean;

  @Field()
  @Column({ type: 'enum', enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RoomMemberEntity, (rm) => rm.user)
  participated: RoomMemberEntity[];

  @OneToMany(() => MessageEntity, (msg) => msg.user)
  messages: MessageEntity[];
}
