import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'; //prettier-ignore

@Entity()
export class AccessToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column({ default: false })
  refreshTokenUsed: boolean;

  @Column()
  identifier: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;

  @Column()
  expiresIn: number;
}
