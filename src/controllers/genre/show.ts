import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Genre } from '../../orm/entities/genre/Genre';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const genreRepository = getRepository(Genre);

  try {
    const genre = await genreRepository.findOne(id, {
      relations: ['books'],
    });

    if (!genre) {
      const customError = new CustomError(404, 'General', `Genre with id:${id} not found.`, ['Genre not found.']);
      return next(customError);
    }
    res.customSuccess(200, 'Genre found', genre);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};