import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreatePublisher = async (req: Request, res: Response, next: NextFunction) => {
  const { name, address, contact } = req.body;
  const errors: string[] = [];

  // Перевірка Name
  if (!name || validator.isEmpty(name)) {
    errors.push('Publisher name is required');
  } else if (!validator.isLength(name, { min: 1, max: 255 })) {
    errors.push('Publisher name must be between 1 and 255 characters');
  }

  // Перевірка Address (опціонально)
  if (address && !validator.isLength(address, { min: 1, max: 255 })) {
    errors.push('Address must be between 1 and 255 characters');
  }

  // Перевірка Contact (опціонально)
  if (contact && !validator.isLength(contact, { min: 1, max: 50 })) {
    errors.push('Contact must be between 1 and 50 characters');
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Publisher validation error', errors);
    return next(customError);
  }

  return next();
};
