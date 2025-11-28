import { getRepository } from 'typeorm';
import { Book } from '../orm/entities/book/Book';

export class BookService {
  private bookRepository = getRepository(Book);

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({
      relations: ['category', 'genre', 'bookAuthors', 'bookAuthors.author'] 
    });
  }

  async findOne(id: number): Promise<Book | null> {
    return this.bookRepository.findOne({
      where: { id_book: id },
      relations: ['category', 'genre', 'bookAuthors', 'bookAuthors.author']
    });
  }

  async create(data: Partial<Book>): Promise<Book> {
    const book = this.bookRepository.create(data);
    return this.bookRepository.save(book);
  }

  async update(id: number, data: Partial<Book>): Promise<Book | null> {
    const book = await this.findOne(id);
    if (!book) return null;

    this.bookRepository.merge(book, data);
    return this.bookRepository.save(book);
  }

  async delete(id: number): Promise<void> {
    await this.bookRepository.delete(id);
  }
}