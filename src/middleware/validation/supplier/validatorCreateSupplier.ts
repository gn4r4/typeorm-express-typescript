import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateSupplier = async (req: Request, res: Response, next: NextFunction) => {
  const { name, contact, address } = req.body;
  const errors: string[] = [];

  // Name validation
  if (!name || validator.isEmpty(String(name))) {
    errors.push('Name is required');
  } else if (!validator.isLength(String(name), { min: 1, max: 255 })) {
    errors.push('Name must be at most 255 characters');
  }

  // Contact validation (optional)
  if (contact !== undefined && contact !== null) {
    if (!validator.isLength(String(contact), { max: 255 })) {
      errors.push('Contact must be at most 255 characters');
    }
  }

  // Address validation (optional)
  if (address !== undefined && address !== null) {
    if (!validator.isLength(String(address), { max: 255 })) {
      errors.push('Address must be at most 255 characters');
    }
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Supplier validation error', errors);
    return next(customError);
  }

  return next();
};
