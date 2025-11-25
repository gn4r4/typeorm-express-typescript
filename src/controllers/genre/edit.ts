import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Genre } from '../../orm/entities/genre/Genre';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name } = req.body;
  const genreRepository = getRepository(Genre);

  try {
    const genre = await genreRepository.findOne({ where: { id_genre: id } });

    if (!genre) {
      const customError = new CustomError(404, 'General', `Genre with id:${id} not found.`, ['Genre not found.']);
      return next(customError);
    }

    genre.name = name;

    await genreRepository.save(genre);
    res.customSuccess(200, 'Genre successfully updated.', genre);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};