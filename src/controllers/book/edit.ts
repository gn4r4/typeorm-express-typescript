import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Book } from '../../orm/entities/book/Book';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { title, id_category, id_genre } = req.body;

  const bookRepository = getRepository(Book);
  try {
    const book = await bookRepository.findOne({ where: { id_book: id } });

    if (!book) {
      const customError = new CustomError(404, 'General', `Book with id:${id} not found.`, ['Book not found.']);
      return next(customError);
    }

    book.title = title;
    book.id_category = id_category;
    book.id_genre = id_genre;

    try {
      await bookRepository.save(book);
      // Примітка: Оновлення авторів тут не реалізовано для стислості, 
      // але логіка така ж: видалити старі зв'язки в BookAuthor і створити нові.
      
      res.customSuccess(200, 'Book successfully updated.');
    } catch (err) {
      const customError = new CustomError(409, 'Raw', `Book '${book.title}' can't be saved.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};