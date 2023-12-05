import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ObjectId } from 'mongodb';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
      ) {}
    
      async findAll(): Promise<User[]> {
        return this.userRepository.find();
      }
    
      async findOne(id: string): Promise<User | undefined> {
        return this.userRepository.findBy({id: new ObjectId(id)}).then()
      }
    
      async create(userData: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(userData);
        return this.userRepository.save(newUser);
      }
    
      async update(id: string, updateUserDto: Partial<User>): Promise<User | undefined> {
        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
      }
    
      async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
      }


      async initAdminUser(): Promise<void> {
        const admin = await this.userRepository.findOne({ where: { email: 'admin' } });
    
        if (!admin) {
          // Si no existe un usuario 'admin', crea uno
          const newAdmin = this.userRepository.create({
            email: 'admin',
            name: 'Admin',
            password: 'admin',
          });
          await this.userRepository.save(newAdmin);
          console.log('Usuario administrador creado correctamente.');
        }
      }
  

}
