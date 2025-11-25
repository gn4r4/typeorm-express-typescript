import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BookAuthor } from '../book_author/BookAuthor';

@Entity('author') // Назва таблиці в БД
export class Author {
  @PrimaryGeneratedColumn({ name: 'id_author' })
  id_author: number;

  @Column({ length: 50 })
  lastname: string;

  @Column({ length: 50 })
  firstname: string;

  @Column({ length: 50, nullable: true })
  patronymic: string;

  @Column({ type: 'date', nullable: true })
  dateofbirth: Date;

  // Зв'язок з проміжною таблицею BookAuthor
  @OneToMany(() => BookAuthor, (bookAuthor) => bookAuthor.author)
  bookAuthors: BookAuthor[];
}