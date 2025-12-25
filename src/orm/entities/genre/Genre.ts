import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from '../book/Book';

@Entity('genre')
export class Genre {
  @PrimaryGeneratedColumn({ name: 'id_genre' })
  id_genre: number;

  @Column({ length: 100, unique: true })
  name: string;

  // Один жанр може мати багато книг
  @OneToMany(() => Book, (book) => book.genre)
  books: Book[];
}