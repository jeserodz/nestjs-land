import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessToken } from './entities/access-token.entity';
import { ConfigProvider } from './providers/config.provider';
import { AuthGuard } from './guards/auth.guard';

@Global()
@Module({})
export class AuthModule {
  static forRoot(options: ConfigProvider): DynamicModule {
    const config = new ConfigProvider(options);
    const CustomConfigProvider = { provide: ConfigProvider, useValue: config };

    return {
      module: AuthModule,
      imports: [TypeOrmModule.forFeature([AccessToken])],
      providers: [CustomConfigProvider, AuthService, AuthGuard],
      controllers: [AuthController],
      exports: [AuthService, AuthGuard],
    };
  }
}
