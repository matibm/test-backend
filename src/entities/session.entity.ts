import { Entity, Column, ObjectIdColumn, ObjectId, Index } from 'typeorm';

@Entity()
export class Session {
  @ObjectIdColumn()
  id: ObjectId;

  @Column(type => ObjectId)  
  userId: ObjectId;

  @Column()
  expireAt: Date; // Campo para controlar la expiración
}