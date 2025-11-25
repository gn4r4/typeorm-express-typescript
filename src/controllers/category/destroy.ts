import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Category } from '../../orm/entities/category/Category';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const categoryRepository = getRepository(Category);

  try {
    const category = await categoryRepository.findOne({ where: { id_category: id } });

    if (!category) {
      const customError = new CustomError(404, 'General', `Category with id:${id} not found.`, ['Category not found.']);
      return next(customError);
    }

    await categoryRepository.remove(category);
    res.customSuccess(200, 'Category successfully deleted.', { id: id });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};