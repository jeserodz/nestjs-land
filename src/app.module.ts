import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../libs/auth/src';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { StorageModule } from '../libs/storage/src';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    StorageModule.forRoot({
      endpoint: process.env.STORAGE_ENDPOINT,
      region: process.env.STORAGE_REGION,
      bucket: process.env.STORAGE_BUCKET,
      accessKey: process.env.STORAGE_ACCESS_KEY,
      secretKey: process.env.STORAGE_SECRET_KEY,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
