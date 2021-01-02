# NestJS Land: Auth

Authentication module for NestJS applications.

# Features

- [x] Use custom user entity classes
- [x] JWT access and refresh tokens
- [x] `AuthGuard` to authenticate requests
- [x] `AuthUser` param decorator to access the session user
- [ ] Generate recovery passwords
- [ ] Send recovery password to users via callback function

# Installation

```sh
$ npm install @nestjs-land/auth
```

# Setup

Import the `AuthModule` into your application your module:

```typescript
...
import { AuthModule } from '../libs/auth/src';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    AuthModule.forRoot({
      userEntity: User,                 // Use your own User entity class
      userIdentifierProperty: 'email',  // Specify the property in User for identity. Eg: 'username', 'email'
      userPasswordProperty: 'password', // Specify the property in User for password.
      jwtSecret: 'secret',
      accessTokenExpirationTime: '1d',
      refreshTokenExpirationTime: '1m',
    })
  ]
})
export class AppModule {}

```

# Usage

## Get access token

Request:

- `GET /auth/login`

Body:

```json
{
  "identity": "user@email.com",
  "password": "12345678"
}
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJ...",
  "refreshToken": "5cCI6IkpXVCJ9...",
  "identifier": "user@email.com",
  "expiresIn": 86400000,
  "expiresAt": "2021-01-03T20:02:46.401Z",
  "id": "8eee5644-c2bc-4053-a56b-14d3327eca94",
  "refreshTokenUsed": false,
  "createdAt": "2021-01-02T20:02:46.000Z"
}
```

## Refresh access token

Request:

- `GET /auth/refresh_token`

Body:

```json
{
  "refreshToken": "5cCI6IkpXVCJ9..."
}
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJ...",
  "refreshToken": "5cCI6IkpXVCJ9...",
  "identifier": "user@email.com",
  "expiresIn": 86400000,
  "expiresAt": "2021-01-03T20:02:46.401Z",
  "id": "8eee5644-c2bc-4053-a56b-14d3327eca94",
  "refreshTokenUsed": false,
  "createdAt": "2021-01-02T20:02:46.000Z"
}
```

## Protect HTTP requests with AuthGuard

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Use the AuthGuard on any controller method or in the controller class.
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
```

## Get the authenticated user with AuthUser

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  findMe(
    // Use the AuthUser decorator to access the authenticated user.
    @AuthUser() user: User,
  ) {
    return user;
  }
}
```
