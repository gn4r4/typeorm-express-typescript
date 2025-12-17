import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateCopybookLocation = async (req: Request, res: Response, next: NextFunction) => {
  const { id_shelf, id_copybook } = req.body;
  const errors: string[] = [];

  // Перевірка ID Shelf
  if (!id_shelf || !validator.isInt(String(id_shelf))) {
    errors.push('Shelf ID is required and must be an integer');
  }

  // Перевірка ID Copybook
  if (!id_copybook || !validator.isInt(String(id_copybook))) {
    errors.push('Copybook ID is required and must be an integer');
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Copybook location validation error', errors);
    return next(customError);
  }

  return next();
};
