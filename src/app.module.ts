import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transactions';
import { UsersService } from './users/users.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017/test-nestjs',
      synchronize: true, // Sincronización automática de esquemas (solo para desarrollo)
      useNewUrlParser: true,
      useUnifiedTopology: true,
      entities: [ User, Transaction ],
       
    }),
     TransactionsModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly userService: UsersService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.userService.initAdminUser(); // Llama al método de inicialización del usuario administrador
  }
}
