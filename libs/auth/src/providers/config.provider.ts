import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigProvider {
  /** TypeORM entity class of the user. */
  userEntity: new () => unknown;

  /** User property name used as identifier. Eg: 'email', 'username' */
  userIdentifierProperty: string;

  /** User property name that contains the password Eg: 'password'  */
  userPasswordProperty: string;

  /** Either the secret for HMAC algorithms, or the PEM encoded private key for RSA and ECDSA. */
  jwtSecret: string;

  /** Expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  accessTokenExpirationTime: number | string;

  /** Expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  refreshTokenExpirationTime: number | string;

  constructor(config: ConfigProvider) {
    {
      Object.assign(this, config);
    }
  }
}
