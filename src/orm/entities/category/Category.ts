import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from '../book/Book';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'id_category' })
  id_category: number;

  @Column({ length: 100 })
  name: string;

  // Одна категорія може мати багато книг
  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}