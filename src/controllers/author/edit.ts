import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Author } from '../../orm/entities/author/Author';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { lastname, firstname, patronymic, dateofbirth } = req.body;
  const authorRepository = getRepository(Author);

  try {
    const author = await authorRepository.findOne({ where: { id_author: id } });

    if (!author) {
      const customError = new CustomError(404, 'General', `Author with id:${id} not found.`, ['Author not found.']);
      return next(customError);
    }

    author.lastname = lastname;
    author.firstname = firstname;
    author.patronymic = patronymic;
    author.dateofbirth = dateofbirth;

    await authorRepository.save(author);
    res.customSuccess(200, 'Author successfully updated.', author);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};