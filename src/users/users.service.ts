import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AuthService } from '../../libs/auth/src';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  create(createUserDto: CreateUserDto) {
    createUserDto.password = this.authService.encryptPassword(
      createUserDto.password,
    );

    return this.entityManager.save(User, createUserDto);
  }

  findAll() {
    return this.entityManager.find(User);
  }

  findOne(id: number) {
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

  remove(id: number) {
    return this.entityManager.delete(User, id);
  }
}
