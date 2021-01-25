import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/files.entity';
import { ConfigProvider } from './providers/config.provider';
import { StorageService } from './storage.service';

@Global()
@Module({})
export class StorageModule {
  static forRoot(options: ConfigProvider): DynamicModule {
    const config = new ConfigProvider(options);
    const CustomConfigProvider = { provide: ConfigProvider, useValue: config };
    return {
      module: StorageModule,
      imports: [TypeOrmModule.forFeature([File])],
      providers: [CustomConfigProvider, StorageService],
      exports: [StorageService],
    };
  }
}
