import { Request, Response, NextFunction } from 'express';
import { getRepository, Not } from 'typeorm'; // Import Not (хоча можна і без нього через JS перевірку)

import { User } from '../../../orm/entities/users/User';
import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { ErrorValidation } from '../../../utils/response/custom-error/types';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  let { username, name } = req.body;
  const id = Number(req.params.id); // Отримуємо ID користувача, якого редагуємо
  
  const errorsValidation: ErrorValidation[] = [];
  const userRepository = getRepository(User);

  username = !username ? '' : username;
  name = !name ? '' : name;

  // Шукаємо користувача з таким самим username
  const userByUsername = await userRepository.findOne({ where: { username } });
  
  // Якщо знайшли користувача, І його ID не співпадає з тим, якого ми редагуємо -> Помилка
  if (userByUsername && userByUsername.id !== id) {
    errorsValidation.push({ username: `Username '${username}' already exists` });
  }

  if (req.body.email) {
      const userByEmail = await userRepository.findOne({ where: { email: req.body.email } });
      if (userByEmail && userByEmail.id !== id) {
        errorsValidation.push({ email: `Email '${req.body.email}' already exists` });
      }
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Edit user validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};