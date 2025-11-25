import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Book } from '../../orm/entities/book/Book';
import { BookAuthor } from '../../orm/entities/book_author/BookAuthor';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { title, id_category, id_genre, authorIds } = req.body;
  // authorIds - очікуємо масив ID авторів, наприклад [1, 5, 10]

  const bookRepository = getRepository(Book);
  const bookAuthorRepository = getRepository(BookAuthor);

  try {
    // 1. Створюємо саму книгу
    const newBook = bookRepository.create({
      title,
      id_category,
      id_genre
    });
    
    const savedBook = await bookRepository.save(newBook);

    // 2. Якщо передали авторів, створюємо зв'язки
    if (authorIds && Array.isArray(authorIds)) {
      const bookAuthorEntries = authorIds.map((authorId: number) => {
        return bookAuthorRepository.create({
            id_book: savedBook.id_book,
            id_author: authorId
        });
      });
      await bookAuthorRepository.save(bookAuthorEntries);
    }

    // 3. Повертаємо створену книгу (можна зробити повторний запит, щоб показати з авторами)
    res.customSuccess(201, 'Book successfully created.', savedBook);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't create book.`, null, err);
    return next(customError);
  }
};