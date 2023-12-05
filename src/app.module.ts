import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transactions.entity';
import { UsersService } from './users/users.service';
import { Session } from './entities/session.entity';
import { MongoRepository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session]),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017/test-nestjs',
      synchronize: true, // Sincronización automática de esquemas (solo para desarrollo)
      useNewUrlParser: true,
      useUnifiedTopology: true,
      entities: [ User, Transaction, Session ],
       
    }),
     TransactionsModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Session)
    private readonly sessionRepository: MongoRepository<Session>
    ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.setupIndexes();
    await this.userService.initAdminUser(); // Llama al método de inicialización del usuario administrador
  }
  
  async setupIndexes(): Promise<void> {
    await this.sessionRepository.createCollectionIndex(
      { expireAt: 1 },
      { expireAfterSeconds: 900 },
    );
  }
}
