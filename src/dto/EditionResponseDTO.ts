import { Edition } from '../orm/entities/edition/Edition';
import { BookResponseDTO } from './BookResponseDTO';
import { PublisherResponseDTO } from './PublisherResponseDTO';

export class EditionResponseDTO {
  id: number;
  yearPublication: Date;
  book: BookResponseDTO | null;
  publisher: PublisherResponseDTO | null;

  constructor(edition: Edition) {
    this.id = edition.id_edition;
    this.yearPublication = edition.yearpublication;

    // Вкладаємо вже існуючий BookResponseDTO (який сам підтягне авторів, жанри і т.д.)
    this.book = edition.book ? new BookResponseDTO(edition.book) : null;
    this.publisher = edition.publisher ? new PublisherResponseDTO(edition.publisher) : null;
  }
}