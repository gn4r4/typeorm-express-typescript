import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateEdition = async (req: Request, res: Response, next: NextFunction) => {
  const { id_book, id_publisher, yearpublication } = req.body;
  const errors: string[] = [];

  // Перевірка ID Book
  if (!id_book || !validator.isInt(String(id_book))) {
    errors.push('Book ID is required and must be an integer');
  }

  // Перевірка ID Publisher
  if (!id_publisher || !validator.isInt(String(id_publisher))) {
    errors.push('Publisher ID is required and must be an integer');
  }

  // Перевірка Year Publication
  if (!yearpublication || validator.isEmpty(String(yearpublication))) {
    errors.push('Publication year is required');
  } else if (!validator.isISO8601(yearpublication)) {
    errors.push('Publication year must be a valid date (YYYY-MM-DD)');
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Edition validation error', errors);
    return next(customError);
  }

  return next();
};
