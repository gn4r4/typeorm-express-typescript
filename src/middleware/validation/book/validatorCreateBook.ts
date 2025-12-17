import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, id_category, id_genre, id_author } = req.body;
  const errors: string[] = [];

  // Перевірка Title
  if (!title || validator.isEmpty(title)) {
    errors.push('Title is required');
  }

  // Перевірка ID Category
  if (!id_category || !validator.isInt(String(id_category))) {
    errors.push('Category ID is required and must be an integer');
  }

  // Перевірка ID Genre
  if (!id_genre || !validator.isInt(String(id_genre))) {
    errors.push('Genre ID is required and must be an integer');
  }

  // Перевірка ID Author (Нове)
  if (!id_author || !validator.isInt(String(id_author))) {
    errors.push('Author ID is required and must be an integer');
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Book validation error', errors);
    return next(customError);
  }

  return next();
};