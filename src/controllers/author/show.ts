import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Author } from '../../orm/entities/author/Author';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const authorRepository = getRepository(Author);

  try {
    const author = await authorRepository.findOne(id, {
      relations: ['bookAuthors', 'bookAuthors.book'],
    });

    if (!author) {
      const customError = new CustomError(404, 'General', `Author with id:${id} not found.`, ['Author not found.']);
      return next(customError);
    }
    res.customSuccess(200, 'Author found', author);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};