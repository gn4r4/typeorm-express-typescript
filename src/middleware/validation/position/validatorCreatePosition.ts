import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreatePosition = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const errors: string[] = [];

  // Перевірка Name
  if (!name || validator.isEmpty(name)) {
    errors.push('Position name is required');
  } else if (!validator.isLength(name, { min: 1, max: 100 })) {
    errors.push('Position name must be between 1 and 100 characters');
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Position validation error', errors);
    return next(customError);
  }

  return next();
};
