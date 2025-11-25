import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from '../book/Book';
import { Author } from '../author/Author';

@Entity('book_author')
export class BookAuthor {
  @PrimaryColumn()
  id_book: number;

  @PrimaryColumn()
  id_author: number;

  @ManyToOne(() => Book, (book) => book.bookAuthors)
  @JoinColumn({ name: 'id_book' })
  book: Book;

  @ManyToOne(() => Author, (author) => author.bookAuthors)
  @JoinColumn({ name: 'id_author' })
  author: Author;
}