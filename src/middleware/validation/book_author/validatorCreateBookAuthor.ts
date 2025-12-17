import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateBookAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const { id_book, id_author } = req.body;
  const errors: string[] = [];

  // Перевірка ID Book
  if (!id_book || !validator.isInt(String(id_book))) {
    errors.push('Book ID is required and must be an integer');
  }

  // Перевірка ID Author
  if (!id_author || !validator.isInt(String(id_author))) {
    errors.push('Author ID is required and must be an integer');
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Book author validation error', errors);
    return next(customError);
  }

  return next();
};
