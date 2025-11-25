import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Book } from '../../orm/entities/book/Book';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const bookRepository = getRepository(Book);

  try {
    const book = await bookRepository.findOne(id, {
      relations: ['category', 'genre', 'bookAuthors', 'bookAuthors.author'],
    });

    if (!book) {
      const customError = new CustomError(404, 'General', `Book with id:${id} not found.`, ['Book not found.']);
      return next(customError);
    }

    res.customSuccess(200, 'Book found', book);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};