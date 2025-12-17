import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateOrders = async (req: Request, res: Response, next: NextFunction) => {
  const { dateorder, status } = req.body;
  const errors: string[] = [];

  // Перевірка Date Order
  if (!dateorder || validator.isEmpty(String(dateorder))) {
    errors.push('Order date is required');
  } else if (!validator.isISO8601(dateorder)) {
    errors.push('Order date must be a valid date (YYYY-MM-DD)');
  }

  // Перевірка Status
  if (!status || validator.isEmpty(status)) {
    errors.push('Order status is required');
  } else if (!validator.isLength(status, { min: 1, max: 50 })) {
    errors.push('Status must be between 1 and 50 characters');
  } else {
    // Перевірка на допустимі значення статусу
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'очікується', 'в обробці', 'завершено', 'скасовано'];
    if (!validStatuses.includes(status.toLowerCase())) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Orders validation error', errors);
    return next(customError);
  }

  return next();
};
