import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AuthService } from '../../libs/auth/src';
import { StorageService } from '../../libs/storage/src';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(StorageService) private readonly storageService: StorageService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = this.authService.encryptPassword(
      createUserDto.password,
    );

    return this.entityManager.save(User, createUserDto);
  }

  async findAll() {
    return this.entityManager.find(User);
  }

  async findOne(id: number) {
    return this.entityManager.findOne(User, id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    updateUserDto.password = this.authService.encryptPassword(
      updateUserDto.password,
    );

    const user = await this.entityManager.preload(User, {
      id,
      ...updateUserDto,
    });

    return this.entityManager.save(User, user);
  }

  async remove(id: number) {
    return this.entityManager.delete(User, id);
  }

  async saveProfilePicture(id: number, buffer: Buffer) {
    const user = await this.findOne(id);
    const file = await this.storageService.saveFile(buffer);
    user.profilePicture = file;
    this.entityManager.save(User, user);
  }
}
