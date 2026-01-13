import { Edition } from '../orm/entities/edition/Edition';

export class CatalogResponseDTO {
  id: number;
  title: string;
  authors: string[];    // Масив імен: ["Шевченко Т.", "Франко І."]
  genre: string;
  category: string;
  publisher: string;
  year: number;
  isAvailable: boolean; 

  constructor(edition: Edition) {
    this.id = edition.id_edition;
    this.year = new Date(edition.yearpublication).getFullYear();
    this.title = edition.book?.title || 'Без назви';
    this.genre = edition.book?.genre?.name || 'Інше';
    this.category = edition.book?.category?.name || 'Загальне';
    this.publisher = edition.publisher?.name || '';

    if (edition.book?.bookAuthors && edition.book.bookAuthors.length > 0) {
      this.authors = edition.book.bookAuthors.map(ba => {
        const name = ba.author.firstname ? `${ba.author.firstname[0]}.` : '';
        return `${ba.author.lastname} ${name}`;
      });
    } else {
      this.authors = [];
    }

    if (edition.copybooks && edition.copybooks.length > 0) {
      const hasAvailableCopy = edition.copybooks.some(
        (c) => c.status && c.status === 'доступний'
      );
      this.isAvailable = hasAvailableCopy;
    } else {
      this.isAvailable = false;
    }
  }
}