import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/UserService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { createJwtToken } from '../../utils/createJwtToken';
import { UserResponseDTO } from '../../dto/UserResponseDTO';
import { Role } from '../../orm/entities/users/types';

export class AuthController {
  private userService = new UserService();

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      // Передаємо true, щоб дістати пароль для перевірки
      const user = await this.userService.findByEmail(email, true);

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

      const newUser = await this.userService.create({ email, password });
      
      // Повертаємо DTO, щоб приховати пароль
      res.customSuccess(200, 'User successfully created.', new UserResponseDTO(newUser));
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

      await this.userService.update(id, { password: passwordNew });
      res.customSuccess(200, 'Password successfully changed.');
    } catch (err) {
      return next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}