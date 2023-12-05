import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Session } from 'src/entities/session.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([User, Session])]
})
export class UsersModule {}
