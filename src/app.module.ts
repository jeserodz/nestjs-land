import * as path from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../libs/auth/src';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.resolve(__dirname, '../database.sqlite'),
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule.forRoot({
      userEntity: User,
      userIdentifierProperty: 'email',
      userPasswordProperty: 'password',
      jwtSecret: 'secret',
      accessTokenExpirationTime: '1d',
      refreshTokenExpirationTime: '1m',
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
