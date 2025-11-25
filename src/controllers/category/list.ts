import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Category } from '../../orm/entities/category/Category';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const categoryRepository = getRepository(Category);
  try {
    const categories = await categoryRepository.find({
      relations: ['books'], // Підтягуємо пов'язані книги
    });
    res.customSuccess(200, 'List of categories.', categories);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of categories.`, null, err);
    return next(customError);
  }
};