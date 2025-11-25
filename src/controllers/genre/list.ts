import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Genre } from '../../orm/entities/genre/Genre';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const genreRepository = getRepository(Genre);
  try {
    const genres = await genreRepository.find({
      relations: ['books'],
    });
    res.customSuccess(200, 'List of genres.', genres);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of genres.`, null, err);
    return next(customError);
  }
};