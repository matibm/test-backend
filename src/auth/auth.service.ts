import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/entities/session.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { jwtConstants } from './constants';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
     
  ) {}

  async validateUser(user: User, password: string): Promise<boolean> {
    if (user) {
      // Comparar la contraseña ingresada con el hash almacenado
      return bcrypt.compare(password, user.password); // Devuelve true o false según coincida o no
    }

    return false; // Si el usuario no existe
  }
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Número de rounds de salt (factor de costo)
    return bcrypt.hash(password, saltRounds);
  }

  async login(user: User, password: string): Promise<any> {

    if (user && (await this.validateUser(user, password))) {
      const payload = { email: user.email, sub: user.id };
      this.createSession(user.id.toString());
      return {
        access_token: this.jwtService.sign(payload, {
          expiresIn: '900s',
          secret: jwtConstants.secret
        }),
      };
    }

    return null; // Devuelve null si el usuario no existe o la contraseña no coincide
  }

  async createSession(userId: string): Promise<void> {
    const session = new Session();
    session.userId = new ObjectId(userId);
    session.expireAt = new Date(Date.now() + 900000);
    await this.sessionRepository.save(session);
  }
}
