import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() data: LoginDTO) {
    return this.authService.generateAccessToken(data);
  }

  @Post('/refresh_token')
  refreshToken(@Body() data: RefreshTokenDTO) {
    return this.authService.generateAccessTokenFromRefreshToken(data);
  }
}
