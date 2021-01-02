import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'; // prettier-ignore
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { AccessToken } from './entities/access-token.entity';
import { ConfigProvider } from './providers/config.provider';

import ms = require('ms');

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigProvider) private readonly config: ConfigProvider,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async generateAccessToken(args: LoginDTO) {
    const user = await this.entityManager.findOne(this.config.userEntity, {
      where: { [this.config.userIdentifierProperty]: args.identifier },
    });

    if (!user) {
      throw new NotFoundException();
    }

    if (
      !this.verifyPassword(
        args.password,
        user[this.config.userPasswordProperty],
      )
    ) {
      throw new UnauthorizedException();
    }

    const token = await this.createToken(
      user[this.config.userIdentifierProperty],
    );

    return token;
  }

  async generateAccessTokenFromRefreshToken(data: RefreshTokenDTO) {
    const { refreshToken } = data;

    const existingToken = await this.entityManager.findOne(AccessToken, {
      where: { refreshToken },
    });

    if (!existingToken) {
      throw new NotFoundException();
    }

    if (!jwt.verify(existingToken.refreshToken, this.config.jwtSecret)) {
      throw new UnauthorizedException();
    }

    const token = await this.createToken(existingToken.identifier);

    return token;
  }

  /**
   * Generates a new JWT token.
   * @param identifier User identifier. (ref: `ConfigProvider#userIdentifierProperty`).
   */
  async createToken(identifier: string) {
    const accessToken = this.generateJwt(
      { identifier },
      this.config.accessTokenExpirationTime,
    );

    const refreshToken = this.generateJwt(
      { identifier, accessToken },
      this.config.refreshTokenExpirationTime,
    );

    const expiresIn = ms(String(this.config.accessTokenExpirationTime));

    const token = await this.entityManager.save(AccessToken, {
      accessToken,
      refreshToken,
      identifier,
      expiresIn,
      expiresAt: new Date(Date.now() + expiresIn).toISOString(),
    });

    return token;
  }

  encryptPassword(plainText: string) {
    return bcrypt.hashSync(plainText, 10);
  }

  verifyPassword(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
  }

  generateJwt(payload: any, expiresIn: number | string) {
    return jwt.sign(payload, this.config.jwtSecret, { expiresIn });
  }

  async verifyAccessToken(accessToken: string) {
    const existingToken = await this.entityManager.findOne(AccessToken, {
      where: { accessToken },
    });

    if (!existingToken) {
      throw new NotFoundException();
    }

    if (!jwt.verify(existingToken.accessToken, this.config.jwtSecret)) {
      throw new UnauthorizedException();
    }

    const user = await this.entityManager.findOne(this.config.userEntity, {
      where: { [this.config.userIdentifierProperty]: existingToken.identifier },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return { token: existingToken, user };
  }
}
