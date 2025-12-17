import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateEmployee = async (req: Request, res: Response, next: NextFunction) => {
  const { lastname, firstname, patronymic, contact, address, id_position } = req.body;
  const errors: string[] = [];

  // Перевірка Lastname
  if (!lastname || validator.isEmpty(lastname)) {
    errors.push('Employee lastname is required');
  } else if (!validator.isLength(lastname, { min: 1, max: 50 })) {
    errors.push('Lastname must be between 1 and 50 characters');
  }

  // Перевірка Firstname
  if (!firstname || validator.isEmpty(firstname)) {
    errors.push('Employee firstname is required');
  } else if (!validator.isLength(firstname, { min: 1, max: 50 })) {
    errors.push('Firstname must be between 1 and 50 characters');
  }

  // Перевірка Patronymic (опціонально)
  if (patronymic && !validator.isLength(patronymic, { min: 1, max: 50 })) {
    errors.push('Patronymic must be between 1 and 50 characters');
  }

  // Перевірка Contact
  if (!contact || validator.isEmpty(contact)) {
    errors.push('Employee contact is required');
  } else if (!validator.isLength(contact, { min: 1, max: 50 })) {
    errors.push('Contact must be between 1 and 50 characters');
  }

  // Перевірка Address
  if (!address || validator.isEmpty(address)) {
    errors.push('Employee address is required');
  } else if (!validator.isLength(address, { min: 1, max: 255 })) {
    errors.push('Address must be between 1 and 255 characters');
  }

  // Перевірка ID Position
  if (!id_position || !validator.isInt(String(id_position))) {
    errors.push('Position ID is required and must be an integer');
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Employee validation error', errors);
    return next(customError);
  }

  return next();
};
