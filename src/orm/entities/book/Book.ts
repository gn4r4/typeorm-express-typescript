import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from '../category/Category';
import { Genre } from '../genre/Genre';
import { BookAuthor } from '../book_author/BookAuthor';
import { Edition } from '../edition/Edition';

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn({ name: 'id_book' })
  id_book: number;

  @Column({ length: 255 })
  title: string;

  // Зовнішній ключ на категорію
  @Column()
  id_category: number;

  @ManyToOne(() => Category, (category) => category.books)
  @JoinColumn({ name: 'id_category' }) 
  category: Category;

  // Зовнішній ключ на жанр
  @Column()
  id_genre: number;

  @ManyToOne(() => Genre, (genre) => genre.books)
  @JoinColumn({ name: 'id_genre' })
  genre: Genre;

  // Зв'язок з авторами через проміжну таблицю
  @OneToMany(() => BookAuthor, (bookAuthor) => bookAuthor.book)
  bookAuthors: BookAuthor[];

  // Зв'язок з виданнями
  @OneToMany(() => Edition, (edition) => edition.book)
  editions: Edition[];
}