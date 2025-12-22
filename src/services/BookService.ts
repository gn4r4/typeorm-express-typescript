import { getRepository } from 'typeorm';
import { Book } from '../orm/entities/book/Book';
import { BookAuthor } from '../orm/entities/book_author/BookAuthor';

export class BookService {

  private get bookRepository() {
    return getRepository(Book);
  }
  
  private get bookAuthorRepository() {
    return getRepository(BookAuthor);
  }

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

  async create(data: Partial<Book> & { id_author?: number[] }): Promise<Book> {
    const { id_author, ...bookData } = data;
    
    // 1. Створюємо книгу
    const newBook = this.bookRepository.create(bookData);
    const savedBook = await this.bookRepository.save(newBook);

    // 2. Якщо є автори, створюємо зв'язки
    if (id_author && id_author.length > 0) {
      const links = id_author.map(authId => 
        this.bookAuthorRepository.create({ id_book: savedBook.id_book, id_author: authId })
      );
      await this.bookAuthorRepository.save(links);
    }

    return this.findOne(savedBook.id_book) as Promise<Book>;
  }

  async update(id: number, data: Partial<Book> & { id_author?: number[] }): Promise<Book | null> {
    const { id_author, ...bookData } = data;

    // 1. Оновлюємо основні дані
    await this.bookRepository.update(id, bookData);

    // 2. Якщо передали id_author, оновлюємо зв'язки
    if (id_author) {
      // Спочатку видаляємо старі зв'язки
      await this.bookAuthorRepository.delete({ id_book: id });
      
      // Потім додаємо нові
      if (id_author.length > 0) {
        const links = id_author.map(authId => 
            this.bookAuthorRepository.create({ id_book: id, id_author: authId })
        );
        await this.bookAuthorRepository.save(links);
      }
    }

    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.bookAuthorRepository.delete({ id_book: id }); 
    await this.bookRepository.delete(id);
  }
}