import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Get()
    async getAllTransactions() {
      return await this.transactionsService.findAll();
    }
  
    @Get(':id')
    async getTransactionById(@Param('id') id: string) {
      return await this.transactionsService.findOne(id);
    }
  
    @Post()
    async createTransaction(@Body() transactionData: any) {
      return await this.transactionsService.create(transactionData);
    }
  
    @Patch(':id')
    async updateTransaction(@Param('id') id: string, @Body() transactionData: any) {
      return await this.transactionsService.update(id, transactionData);
    }
  
    @Delete(':id')
    async deleteTransaction(@Param('id') id: string) {
      return await this.transactionsService.remove(id);
    }
}
