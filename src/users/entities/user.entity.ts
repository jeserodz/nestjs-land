import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from '@nestjs-land/storage';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column()
  password: string;

  @Column({ default: false })
  disabled: boolean;

  @OneToOne(() => File, { nullable: true, eager: true })
  @JoinColumn()
  profilePicture: File;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
