import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorEditBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, id_category, id_genre, id_author } = req.body;
  const errors: string[] = [];

  // Перевіряємо ТІЛЬКИ якщо поле було передане

  // Title
  if (title !== undefined && validator.isEmpty(title)) {
    errors.push('Title cannot be empty');
  }

  // Category
  if (id_category !== undefined) {
    if (typeof id_category !== 'number' && !validator.isInt(String(id_category))) {
      errors.push('Category ID must be an integer');
    }
  }

  // Genre
  if (id_genre !== undefined) {
    if (typeof id_genre !== 'number' && !validator.isInt(String(id_genre))) {
       errors.push('Genre ID must be an integer');
    }
  }

  // Authors (Масив)
  if (id_author !== undefined) {
    if (!Array.isArray(id_author)) {
      errors.push('Authors must be an array');
    } else if (id_author.length === 0) {
      // Якщо передали порожній масив авторів при редагуванні — це може бути помилкою або вимогою.
      // Зазвичай книгу не можна залишити без авторів.
      errors.push('At least one Author is required'); 
    } else {
      const allIntegers = id_author.every((id: any) => Number.isInteger(id) || validator.isInt(String(id)));
      if (!allIntegers) {
        errors.push('All Author IDs must be integers');
      }
    }
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Book edit validation error', errors);
    return next(customError);
  }

  return next();
};