import { getRepository } from 'typeorm';
import { BookAuthor } from '../orm/entities/book_author/BookAuthor';

export class BookAuthorService {
  private bookAuthorRepository = getRepository(BookAuthor);

  async create(id_book: number, id_author: number): Promise<BookAuthor> {
    const bookAuthor = this.bookAuthorRepository.create({ id_book, id_author });
    return this.bookAuthorRepository.save(bookAuthor);
  }

  async delete(id_book: number, id_author: number): Promise<void> {
    await this.bookAuthorRepository.delete({ id_book, id_author });
  }
  
  // Метод для отримання всіх авторів певної книги
  async findByBook(id_book: number): Promise<BookAuthor[]> {
      return this.bookAuthorRepository.find({ 
          where: { id_book },
          relations: ['author']
      });
  }
}