import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ObjectId } from 'mongodb';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTransactions() {
    return await this.transactionsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTransactionById(@Param('id') id: string) {
    return await this.transactionsService.findOne({ _id: new ObjectId(id) });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTransaction(@Body() transactionData: any) {
    return await this.transactionsService.create(transactionData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateTransaction(
    @Param('id') id: string,
    @Body() transactionData: any,
  ) {
    return await this.transactionsService.update(id, transactionData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTransaction(@Param('id') id: string) {
    return await this.transactionsService.remove(id);
  }

  @Get('generate/:userId')
  @UseGuards(JwtAuthGuard)
  async generateTransactions(@Param('userId') userId: string) {
    const numberOfTransactions = 50000;
    const minAmount = 1000;
    const maxAmount = 100000;
    console.log(
      `Creando ${numberOfTransactions} transacciones para el usuario ${userId}`,
    );

    const transactions = [];
    for (let i = 0; i < numberOfTransactions; i++) {
      const amount =
        Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;
      transactions.push({
        userId: new ObjectId(userId),
        amount,
        description: `Transacción N°${i} amount: ${amount}`,
      });
    }

    await this.transactionsService.createTransactions(transactions);
    return { message: 'Se han creado 50000 transacciones para el usuario.' };
  }

  @Patch('update/:userId')
  async updateTransactions(
    @Param('userId') userId: string,
    @Body() transactionUpdate: {
      amount: number;
      description: string;
    },
  ) {
    const startTime = new Date();
    const transactionUpdateResult = await this.transactionsService.updateTransactionsByUserId(userId, transactionUpdate);    

    const endTime = new Date();
    const elapsedTime = endTime.getTime() - startTime.getTime();
    console.log(`Tiempo de ejecución: ${elapsedTime} milisegundos`);
    return {
      message: `Transacciones actualizadas parcialmente. Tiempo de ejecución: ${elapsedTime} milisegundos`,
      transactionUpdate,
      transactionUpdateResult
    };
  }
}
