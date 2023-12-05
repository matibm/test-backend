
import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class Transaction {
  @ObjectIdColumn()
  id: ObjectId;

  @Column(type => ObjectId)  
  userId: ObjectId;

  @Column()
  amount: number;

  @Column()
  description: string;
 
}