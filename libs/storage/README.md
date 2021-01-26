# NestJS Land: Storage

Files storage module with S3 for NestJS applications.

# Features

- [x] Connect to AWS S3 compatible services.
- [x] Provides a File TypeORM entity that is stored in a database and can be used for relations

# Installation

```sh
$ npm install @nestjs-land/storage
```

# Setup

Import the `StorageModule` into your application module:

```typescript
...
import { StorageModule } from '@nestjs-land/storage';

@Module({
  imports: [
    StorageModule.forRoot({
      endpoint: 's3.us-west-2.amazonaws.com',
      region: 'us-west-2',
      bucket: 'my-bucket',
      accessKey: 'access-key',
      secretKey: 'secret-key',
    }),
  ]
})
export class AppModule {}

```

# Usage

```typescript
// 1. Set relations to the File entity where needed
import { File } from '@nestjs-land/storage';

@Entity()
export class User {
  // ...

  @OneToOne(() => File, { nullable: true, eager: true })
  @JoinColumn()
  profilePicture: File;
}

// 2. Read files from HTTP request
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ...

  @Post(':id/profilePicture')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfilePicture(@UploadedFile() file, @Param('id') id: string) {
    this.usersService.saveProfilePicture(+id, file.buffer);
  }
}

// 3. Use the StorageService to save or delete files
import { StorageService } from '../../libs/storage/src';

@Injectable()
export class UsersService {
  constructor(
    // ...
    private readonly storageService: StorageService,
  ) {}

  // ...

  async saveProfilePicture(userId: number, buffer: Buffer) {
    const user = await this.findOne(userId);
    const file = await this.storageService.saveFile(buffer);
    user.profilePicture = file;
    this.entityManager.save(User, user);
  }
}
```
