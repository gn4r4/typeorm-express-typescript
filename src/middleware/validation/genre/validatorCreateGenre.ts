import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateGenre = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const errors: string[] = [];

  if (!name || validator.isEmpty(name)) {
    errors.push('Name is required');
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Genre validation error', errors);
    return next(customError);
  }

  return next();
};