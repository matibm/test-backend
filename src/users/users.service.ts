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
  private readonly allowedFields = ['name', 'email', 'password'];

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(query: any): Promise<User | undefined> {
    return this.userRepository.findOne({ where: query });
  }
  async getUser(query: any): Promise<Partial<User> | undefined> {
    return this.excludePassword(
      await this.userRepository.findOne({ where: query }),
    );
  }

  async create(userData: Partial<User>): Promise<Partial<User>> {
    userData = this.filterFields(userData, this.allowedFields);
    userData.password = await this.authService.hashPassword(userData.password);
    const newUser = this.userRepository.create(userData);

    const errors = await validate(newUser);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const savedUser = await this.userRepository.save(newUser);
    return this.getUser({ _id: savedUser.id });
  }

  async update(
    id: string,
    updateUserDto: Partial<User>,
  ): Promise<Partial<User> | undefined> {
    updateUserDto = this.filterFields(updateUserDto, this.allowedFields);

    const errors = await validate(updateUserDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.getUser({ _id: new ObjectId(id) });
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const deleteResult = await this.userRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    return { deleted: true };
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
  private filterFields(
    data: Record<string, any>,
    allowedFields: string[],
  ): Record<string, any> {
    return Object.keys(data)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
  }
}
