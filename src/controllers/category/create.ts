import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Category } from '../../orm/entities/category/Category';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const categoryRepository = getRepository(Category);

  try {
    const category = new Category();
    category.name = name;
    
    await categoryRepository.save(category);
    res.customSuccess(201, 'Category successfully created.', category);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't create category.`, null, err);
    return next(customError);
  }
};