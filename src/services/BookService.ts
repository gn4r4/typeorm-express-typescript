import { getRepository } from 'typeorm';
import { Book } from '../orm/entities/book/Book';
import { BookAuthor } from '../orm/entities/book_author/BookAuthor';

export class BookService {
  private bookRepository = getRepository(Book);
  private bookAuthorRepository = getRepository(BookAuthor);

  private relations = ['category', 'genre', 'bookAuthors', 'bookAuthors.author'];

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({
      relations: this.relations,
    });
  }

  async findOne(id: number): Promise<Book | null> {
    return this.bookRepository.findOne({
      where: { id_book: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Book> & { authorIds?: number[] }): Promise<Book> {
    const { authorIds, ...bookData } = data;
    
    // 1. Створюємо книгу
    const newBook = this.bookRepository.create(bookData);
    const savedBook = await this.bookRepository.save(newBook);

    // 2. Якщо є автори, створюємо зв'язки
    if (authorIds && authorIds.length > 0) {
      const links = authorIds.map(authId => 
        this.bookAuthorRepository.create({ id_book: savedBook.id_book, id_author: authId })
      );
      await this.bookAuthorRepository.save(links);
    }

    // Повертаємо книгу з даними
    return this.findOne(savedBook.id_book) as Promise<Book>;
  }

  async update(id: number, data: Partial<Book> & { authorIds?: number[] }): Promise<Book | null> {
    const book = await this.bookRepository.findOne({ where: { id_book: id } });
    if (!book) return null;

    const { authorIds, ...bookData } = data;

    // 1. Оновлюємо основні дані
    this.bookRepository.merge(book, bookData);
    await this.bookRepository.save(book);

    // 2. Якщо передали authorIds, оновлюємо зв'язки (видалити старі -> додати нові)
    if (authorIds) {
      await this.bookAuthorRepository.delete({ id_book: id });
      if (authorIds.length > 0) {
        const links = authorIds.map(authId => 
            this.bookAuthorRepository.create({ id_book: id, id_author: authId })
        );
        await this.bookAuthorRepository.save(links);
      }
    }

    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    // Спочатку видаляємо зв'язки, якщо каскадне видалення не налаштоване в БД
    await this.bookAuthorRepository.delete({ id_book: id }); 
    await this.bookRepository.delete(id);
  }
}