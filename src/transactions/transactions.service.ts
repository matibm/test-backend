import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transactions.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ObjectId, MongoClient } from 'mongodb';
import { validate } from 'class-validator';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {
    this.connectMongoClient();
  }
  private mongoClient: MongoClient;
  private readonly allowedFields = ['userId', 'amount', 'description'];

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async findOne(query: {
    [key: string]: any;
  }): Promise<Transaction | undefined> {
    const transaction = await this.transactionRepository.findOne({
      where: query,
    });
    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }
    return transaction;
  }

  async create(transactionData: Partial<Transaction>): Promise<Transaction> {
    if (!transactionData.userId) {
      throw new BadRequestException('userId is required');
    }

    transactionData = this.filterFields(transactionData, this.allowedFields);

    const userId = new ObjectId(transactionData.userId);
    const newTransaction = this.transactionRepository.create({
      ...transactionData,
      userId: userId,
    });
    newTransaction.userId = userId; // por alguna razon en el create excluye el userId

    const errors = await validate(newTransaction);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.transactionRepository.save(newTransaction);
  }

  async update(
    id: string,
    updateTransactionDto: Partial<Transaction>,
  ): Promise<Transaction | undefined> {
    updateTransactionDto = this.filterFields(
      updateTransactionDto,
      this.allowedFields,
    );
    const errors = await validate(updateTransactionDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const updatedTransaction = await this.transactionRepository.update(
      id,
      updateTransactionDto,
    );
    console.log(updatedTransaction);
    
    if (updatedTransaction.raw?.matchedCount === 0) {
      throw new BadRequestException(`Transaction with id ${id} not found`);
    }
    return this.findOne({ _id: new ObjectId(id) });
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const deleteResult = await this.transactionRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new BadRequestException(`Transaction with id ${id} not found`);
    }
    return { deleted: true };
  }

  async createTransactions(transactionsData: any[]): Promise<void> {
    const errors = await validate(transactionsData);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const transactions = transactionsData.map((data) => {
      const transaction = new Transaction();
      transaction.userId = new ObjectId(data.userId);
      transaction.amount = data.amount;
      if (data.description) transaction.description = data.description;
      return transaction;
    });
    await this.transactionRepository.save(transactions.flat());
  }

  /**
   * Updates transactions for a given user ID with new data.
   * This function uses a batched update to update the transactions in batches of a specified size.
   * but is more slower than using a single update, therefore it is not recommended to use it.
   *
   * @param {string} userId - The ID of the user.
   * @param {Partial<Transaction>} newData - The new data to update the transactions with.
   * @return {Promise<any>} - A promise that resolves with the result of the update.
   */
  async updateTransactionsByUserId2(
    userId: string,
    newData: Partial<Transaction>,
  ): Promise<any> {
    const batchSize = 1000;
    let skip = 0;
    let transactionsUpdated = 0;

    do {
      const transactionsToUpdate = await this.transactionRepository.find({
        where: { userId: new ObjectId(userId) },
        skip,
        take: batchSize,
      });

      if (transactionsToUpdate.length === 0) {
        break;
      }
      const promises = transactionsToUpdate.map((transaction) =>
        this.transactionRepository.update({ id: transaction.id }, newData),
      );

      const results = await Promise.all(promises);
      const updatedCount = results.reduce(
        (acc, result) => acc + result.affected,
        0,
      );
      transactionsUpdated += updatedCount;
      console.log(skip);

      skip += batchSize;
    } while (true);

    console.log(`Total de transacciones actualizadas: ${transactionsUpdated}`);
  }

  // this doesn't work with typeorm
  async updateTransactionsByUserId3(
    userId: string,
    newData: Partial<Transaction>,
  ): Promise<UpdateResult> {
    const data = await this.transactionRepository.update(
      { userId: new ObjectId(userId) },
      newData,
    );
    return data;
  }

  async updateTransactionsByUserId(
    userId: string,
    newData: Partial<Transaction>,
  ): Promise<any> {
    try {
      const transactionsCollection = this.mongoClient
        .db(process.env.DB_NAME)
        .collection('transaction');

      return await transactionsCollection.updateMany(
        { userId: new ObjectId(userId) },
        { $set: newData },
      );
    } catch (error) {
      console.error(error);
    }
  }

  private filterFields(
    data: Record<string, any>,
    allowedFields: string[],
  ): Record<string, any> {
    return Object.keys(data)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
  }

  connectMongoClient() {
    try {
      const mongoUrl = process.env.MONGO_URI;
      this.mongoClient = new MongoClient(mongoUrl);
      this.mongoClient.connect();
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
}
