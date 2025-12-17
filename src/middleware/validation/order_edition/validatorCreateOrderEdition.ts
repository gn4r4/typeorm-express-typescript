import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateOrderEdition = async (req: Request, res: Response, next: NextFunction) => {
  const { id_order, id_edition, quantity } = req.body;
  const errors: string[] = [];

  // Перевірка ID Order
  if (!id_order || !validator.isInt(String(id_order))) {
    errors.push('Order ID is required and must be an integer');
  }

  // Перевірка ID Edition
  if (!id_edition || !validator.isInt(String(id_edition))) {
    errors.push('Edition ID is required and must be an integer');
  }

  // Перевірка Quantity
  if (!quantity || !validator.isInt(String(quantity), { min: 1 })) {
    errors.push('Quantity is required and must be a positive integer');
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Order edition validation error', errors);
    return next(customError);
  }

  return next();
};
