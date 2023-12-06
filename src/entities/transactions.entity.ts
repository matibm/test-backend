
import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Transaction {
  @ObjectIdColumn()
  id: ObjectId;

  @Column(type => ObjectId)
  @IsNotEmpty()
  userId: ObjectId;

  @Column()
  @IsNotEmpty()
  amount: number;

  @Column()
  description: string;
 
}