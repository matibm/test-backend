import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transactions.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Session } from 'src/entities/session.entity';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, AuthService],
  imports: [
    AuthModule,
    JwtModule,
    TypeOrmModule.forFeature([Transaction, Session]),
  ]
})
export class TransactionsModule {}
