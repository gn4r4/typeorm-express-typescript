import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const { lastname, firstname, patronymic, dateofbirth } = req.body;
  const errors: string[] = [];

  // Перевірка Lastname
  if (!lastname || validator.isEmpty(lastname)) {
    errors.push('Author lastname is required');
  } else if (!validator.isLength(lastname, { min: 1, max: 50 })) {
    errors.push('Lastname must be between 1 and 50 characters');
  }

  // Перевірка Firstname
  if (!firstname || validator.isEmpty(firstname)) {
    errors.push('Author firstname is required');
  } else if (!validator.isLength(firstname, { min: 1, max: 50 })) {
    errors.push('Firstname must be between 1 and 50 characters');
  }

  // Перевірка Patronymic (опціонально)
  if (patronymic && !validator.isLength(patronymic, { min: 1, max: 50 })) {
    errors.push('Patronymic must be between 1 and 50 characters');
  }

  // Перевірка Date of Birth (опціонально)
  if (dateofbirth) {
    if (!validator.isISO8601(dateofbirth)) {
      errors.push('Date of birth must be a valid date (YYYY-MM-DD)');
    }
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Author validation error', errors);
    return next(customError);
  }

  return next();
};