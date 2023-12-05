import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transactions.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
      ) {}
    
      async findAll(): Promise<Transaction[]> {
        return this.transactionRepository.find();
      }
    
      async findOne(id: string): Promise<Transaction | undefined> {
        return this.transactionRepository.findOne({where: {id: new ObjectId(id)}});
      }
    
      async create(transactionData: Partial<Transaction>): Promise<Transaction> {
        const newTransaction = this.transactionRepository.create(transactionData);
        return this.transactionRepository.save(newTransaction);
      }
    
      async update(id: string, updateTransactionDto: Partial<Transaction>): Promise<Transaction | undefined> {
        await this.transactionRepository.update(id, updateTransactionDto);
        return this.findOne(id);
      }
    
      async remove(id: string): Promise<void> {
        await this.transactionRepository.delete(id);
      }
}
