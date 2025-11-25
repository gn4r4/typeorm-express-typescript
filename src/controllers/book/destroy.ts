import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Book } from '../../orm/entities/book/Book';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const bookRepository = getRepository(Book);

  try {
    const book = await bookRepository.findOne({ where: { id_book: id } });

    if (!book) {
      const customError = new CustomError(404, 'General', 'Not Found', [`Book with id:${id} doesn't exists.`]);
      return next(customError);
    }

    // TypeORM зазвичай сам видаляє записи з BookAuthor, якщо налаштовано CASCADE,
    // але якщо ні - треба спочатку видалити з BookAuthor вручну.
    await bookRepository.remove(book);

    res.customSuccess(200, 'Book successfully deleted.', { id: book.id_book, title: book.title });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};