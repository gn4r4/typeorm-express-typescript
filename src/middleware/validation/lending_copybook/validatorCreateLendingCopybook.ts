import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateLendingCopybook = async (req: Request, res: Response, next: NextFunction) => {
  const { id_lending, id_copybook } = req.body;
  const errors: string[] = [];

  // Перевірка ID Lending
  if (!id_lending || !validator.isInt(String(id_lending))) {
    errors.push('Lending ID is required and must be an integer');
  }

  // Перевірка ID Copybook
  if (!id_copybook || !validator.isInt(String(id_copybook))) {
    errors.push('Copybook ID is required and must be an integer');
  }

  if (errors.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Lending copybook validation error', errors);
    return next(customError);
  }

  return next();
};
