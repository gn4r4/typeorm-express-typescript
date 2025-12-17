import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateCabinet = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;
  const errors: string[] = [];

  // Перевірка Name
  if (!name || validator.isEmpty(name)) {
    errors.push('Cabinet name is required');
  } else if (!validator.isLength(name, { min: 1, max: 100 })) {
    errors.push('Cabinet name must be between 1 and 100 characters');
  }

  // Перевірка Description (опціонально)
  if (description && !validator.isLength(description, { min: 1, max: 255 })) {
    errors.push('Description must be between 1 and 255 characters');
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Cabinet validation error', errors);
    return next(customError);
  }

  return next();
};
