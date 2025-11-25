import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Book } from '../../orm/entities/book/Book';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const bookRepository = getRepository(Book);
  try {
    const books = await bookRepository.find({
      select: ['id_book', 'title', 'id_category', 'id_genre'], // Вибираємо поля книги
      relations: [
        'category',           // Join Category
        'genre',              // Join Genre
        'bookAuthors',        // Join проміжної таблиці
        'bookAuthors.author'  // Join Author через проміжну таблицю
      ],
    });
    res.customSuccess(200, 'List of books.', books);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of books.`, null, err);
    return next(customError);
  }
};