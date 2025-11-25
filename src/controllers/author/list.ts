import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Author } from '../../orm/entities/author/Author';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const authorRepository = getRepository(Author);
  try {
    const authors = await authorRepository.find({
      // Підтягуємо проміжну таблицю і через неї самі книги
      relations: ['bookAuthors', 'bookAuthors.book'],
    });
    res.customSuccess(200, 'List of authors.', authors);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of authors.`, null, err);
    return next(customError);
  }
};