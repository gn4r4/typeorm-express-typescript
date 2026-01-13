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
  
  // --- ЗМІНА ТУТ: Додаємо поле editions ---
  editions: Array<{
    id_edition: number;
    yearpublication: Date; // або string, залежно від налаштувань TypeORM
    copybooks: Array<{
      id_copybook: number;
      status: string;
    }>;
  }>;

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

    // --- ЗМІНА ТУТ: Мапимо видання та примірники ---
    if (book.editions && book.editions.length > 0) {
      this.editions = book.editions.map(edition => ({
        id_edition: edition.id_edition,
        yearpublication: edition.yearpublication,
        copybooks: edition.copybooks 
          ? edition.copybooks.map(copy => ({
              id_copybook: copy.id_copybook,
              status: copy.status
            })) 
          : []
      }));
    } else {
      this.editions = [];
    }
  }
}