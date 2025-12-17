import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateLending = async (req: Request, res: Response, next: NextFunction) => {
  const { id_reader, id_employee, datelending, datereturn } = req.body;
  const errors: string[] = [];

  // Перевірка ID Reader
  if (!id_reader || !validator.isInt(String(id_reader))) {
    errors.push('Reader ID is required and must be an integer');
  }

  // Перевірка ID Employee
  if (!id_employee || !validator.isInt(String(id_employee))) {
    errors.push('Employee ID is required and must be an integer');
  }

  // Перевірка Date Lending
  if (!datelending || validator.isEmpty(String(datelending))) {
    errors.push('Lending date is required');
  } else if (!validator.isISO8601(datelending)) {
    errors.push('Lending date must be a valid date (YYYY-MM-DD)');
  }

  // Перевірка Date Return (опціонально)
  if (datereturn) {
    if (!validator.isISO8601(datereturn)) {
      errors.push('Return date must be a valid date (YYYY-MM-DD)');
    } else {
      // Перевірка, що дата повернення не раніше дати видачі
      const lending = new Date(datelending);
      const returnDate = new Date(datereturn);
      if (returnDate < lending) {
        errors.push('Return date cannot be before lending date');
      }
    }
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Lending validation error', errors);
    return next(customError);
  }

  return next();
};
