import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum USER_ROLE {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
@Index(['provider', 'providerId'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  provider?: string | null;

  @Column({ type: 'varchar', nullable: true, unique: true })
  providerId?: string | null;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 150 })
  password: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar?: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  emailVerificationToken?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  emailVerificationTokenExpiry?: Date | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  passwordResetToken?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetTokenExpiry?: Date | null;

  @Column({ type: 'boolean', default: false })
  emailverified: boolean;

  @Column({ type: 'enum', enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
