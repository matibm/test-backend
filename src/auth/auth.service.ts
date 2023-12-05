import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/entities/session.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>
    ) {}

  async validateUser(username: string, password: string): Promise<any> {
   
    const isValidUser = username === 'user' && password === 'password';
    if (isValidUser) {
      return { username };
    }
    return null;
  }

  async login(user: any) {
    console.log(user);
    
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createSession(userId: string): Promise<void> {
    const session = new Session();
    session.userId = new ObjectId(userId);
    session.expireAt = new Date(Date.now() + 900000);
    await this.sessionRepository.save(session);
  }
}