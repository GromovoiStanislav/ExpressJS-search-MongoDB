import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @ObjectIdColumn()
  _id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  price: number;
}
