import { Edition } from '../orm/entities/edition/Edition';
import { BookResponseDTO } from './BookResponseDTO';
import { PublisherResponseDTO } from './PublisherResponseDTO';

export class EditionResponseDTO {
  id: number;
  book: BookResponseDTO | null;
  publisher: PublisherResponseDTO | null;
  yearPublication: Date;
  ISBN?: string | null;
  pages?: number | null;

  constructor(edition: Edition) {
    this.id = edition.id_edition;
    this.yearPublication = edition.yearpublication;
    this.ISBN = edition.ISBN || null;
    this.pages = edition.pages ?? null;

    this.book = edition.book ? new BookResponseDTO(edition.book) : null;
    this.publisher = edition.publisher ? new PublisherResponseDTO(edition.publisher) : null;
  }
}