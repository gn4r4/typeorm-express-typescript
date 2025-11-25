import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Author } from '../../orm/entities/author/Author';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { lastname, firstname, patronymic, dateofbirth } = req.body;
  const authorRepository = getRepository(Author);

  try {
    const author = new Author();
    author.lastname = lastname;
    author.firstname = firstname;
    author.patronymic = patronymic;
    author.dateofbirth = dateofbirth;

    await authorRepository.save(author);
    res.customSuccess(201, 'Author successfully created.', author);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't create author.`, null, err);
    return next(customError);
  }
};