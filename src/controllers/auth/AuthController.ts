import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/UserService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { createJwtToken } from '../../utils/createJwtToken';
import { Role } from '../../orm/entities/users/types';

export class AuthController {
  private userService = new UserService();

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const user = await this.userService.findByEmail(email, true); // true = завантажити пароль

      if (!user || !user.checkIfPasswordMatch(password)) {
        return next(new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']));
      }

      const token = createJwtToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as Role,
        created_at: user.created_at,
      });

      res.customSuccess(200, 'Token successfully created.', `Bearer ${token}`);
    } catch (err) {
      return next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const existing = await this.userService.findByEmail(email);
      if (existing) {
        return next(new CustomError(400, 'General', 'User already exists', [`Email '${email}' already exists`]));
      }

      // Пароль буде захешовано у сервісі
      await this.userService.create({ email, password }); 
      res.customSuccess(200, 'User successfully created.');
    } catch (err) {
      return next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { password, passwordNew } = req.body;
    const { id } = req.jwtPayload;

    try {
      const user = await this.userService.findByEmail(req.jwtPayload.email, true);
      if (!user) return next(new CustomError(404, 'General', 'Not Found', ['User not found.']));

      if (!user.checkIfPasswordMatch(password)) {
        return next(new CustomError(400, 'General', 'Not Found', ['Incorrect password']));
      }

      // Оновлюємо пароль через сервіс
      await this.userService.update(id, { password: passwordNew });
      res.customSuccess(200, 'Password successfully changed.');
    } catch (err) {
      return next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}