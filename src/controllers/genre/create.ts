import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Genre } from '../../orm/entities/genre/Genre';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const genreRepository = getRepository(Genre);

  try {
    const genre = new Genre();
    genre.name = name;

    await genreRepository.save(genre);
    res.customSuccess(201, 'Genre successfully created.', genre);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't create genre.`, null, err);
    return next(customError);
  }
};