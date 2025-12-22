import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log('DEBUG: Body received:', req.body);
  console.log('DEBUG: Headers:', req.headers['content-type']);
  
  // Дістаємо дані. Зверни увагу: id_author тут буде масивом чисел
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

  // Перевірка ID Author (ВИПРАВЛЕНО для масиву)
  // Ми перевіряємо, чи це масив і чи він не порожній
  if (!id_author || !Array.isArray(id_author) || id_author.length === 0) {
    errors.push('At least one Author is required');
  } else {
    // Перевіряємо, чи кожен елемент масиву є числом
    const allIntegers = id_author.every((id: any) => Number.isInteger(id) || validator.isInt(String(id)));
    if (!allIntegers) {
      errors.push('All Author IDs must be integers');
    }
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Book validation error', errors);
    return next(customError);
  }

  return next();
};