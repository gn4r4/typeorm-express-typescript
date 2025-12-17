import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateShelf = async (req: Request, res: Response, next: NextFunction) => {
  const { id_cabinet, shelfcode } = req.body;
  const errors: string[] = [];

  // Перевірка ID Cabinet
  if (!id_cabinet || !validator.isInt(String(id_cabinet))) {
    errors.push('Cabinet ID is required and must be an integer');
  }

  // Перевірка Shelf Code
  if (!shelfcode || validator.isEmpty(shelfcode)) {
    errors.push('Shelf code is required');
  } else if (!validator.isLength(shelfcode, { min: 1, max: 50 })) {
    errors.push('Shelf code must be between 1 and 50 characters');
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Shelf validation error', errors);
    return next(customError);
  }

  return next();
};
