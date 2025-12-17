import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateCopybook = async (req: Request, res: Response, next: NextFunction) => {
  const { id_edition, status } = req.body;
  const errors: string[] = [];

  // Перевірка ID Edition
  if (!id_edition || !validator.isInt(String(id_edition))) {
    errors.push('Edition ID is required and must be an integer');
  }

  // Перевірка Status
  if (!status || validator.isEmpty(status)) {
    errors.push('Copybook status is required');
  } else if (!validator.isLength(status, { min: 1, max: 50 })) {
    errors.push('Status must be between 1 and 50 characters');
  } else {
    // Перевірка на допустимі значення статусу
    const validStatuses = ['доступний', 'виданий', 'available', 'issued'];
    if (!validStatuses.includes(status.toLowerCase())) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Copybook validation error', errors);
    return next(customError);
  }

  return next();
};
