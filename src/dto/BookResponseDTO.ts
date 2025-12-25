import { Book } from '../orm/entities/book/Book';
import { CategoryResponseDTO } from './CategoryResponseDTO';
import { GenreResponseDTO } from './GenreResponseDTO';
import { AuthorResponseDTO } from './AuthorResponseDTO';

export class BookResponseDTO {
  id: number;
  title: string;
  category: CategoryResponseDTO | null;
  genre: GenreResponseDTO | null;
  authors: AuthorResponseDTO[];

  constructor(book: Book) {
    this.id = book.id_book;
    this.title = book.title;
    
    this.category = book.category ? new CategoryResponseDTO(book.category) : null;
    this.genre = book.genre ? new GenreResponseDTO(book.genre) : null;

    if (book.bookAuthors && book.bookAuthors.length > 0) {
      this.authors = book.bookAuthors.map(ba => new AuthorResponseDTO(ba.author));
    } else {
      this.authors = [];
    }
  }
}