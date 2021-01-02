import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // extract auth header from HTTP request
    const authHeader = request.headers['authorization'];

    // validate auth header is present
    if (!authHeader) throw new UnauthorizedException();

    // subtract auth header type keyword
    const jwt = authHeader.replace('Bearer ', '');

    // verify the access token is valid
    try {
      const { token, user } = await this.authService.verifyAccessToken(jwt);
      request.token = token;
      request.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}
