import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ObjectId } from 'mongodb';
import { AuthService } from 'src/auth/auth.service';
import { validate } from 'class-validator';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return users.map(user => this.excludePassword(user));
  }

  async findOne(query: any): Promise<User | undefined> {
    return this.userRepository.findOne({ where: query });
  }

  async create(userData: Partial<User>): Promise<User> {
    userData.password = await this.authService.hashPassword(userData.password);
    const newUser = this.userRepository.create(userData);

    const errors = await validate(newUser);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  
    return this.userRepository.save(newUser);
  }

  async update(
    id: string,
    updateUserDto: Partial<User>,
  ): Promise<User | undefined> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async initAdminUser(): Promise<void> {
    const users = await this.findAll();
    if (users.length > 0) {
      return;
    } else {
      await this.create({
        email: 'admin',
        name: 'Admin',
        password: 'admin',
      });

      console.log('Usuario administrador creado correctamente.');
    }
  }

  private excludePassword(user: User): Partial<User> {
    const { password, ...result } = user;
    return result;
  }
}
