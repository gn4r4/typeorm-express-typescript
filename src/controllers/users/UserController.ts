import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/UserService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export class UserController {
  private userService = new UserService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.findAll();
      res.customSuccess(200, 'List of users.', users);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const user = await this.userService.findOne(id);
      if (!user) return next(new CustomError(404, 'General', `User with id:${id} not found.`));
      res.customSuccess(200, 'User found', user);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const { username, name } = req.body; // Тільки ці поля дозволяв старий контролер
    try {
      const user = await this.userService.update(id, { username, name });
      if (!user) return next(new CustomError(404, 'General', `User with id:${id} not found.`));
      res.customSuccess(200, 'User successfully saved.');
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const user = await this.userService.findOne(id);
      if (!user) return next(new CustomError(404, 'General', `User with id:${id} not found.`));
      await this.userService.delete(id);
      res.customSuccess(200, 'User successfully deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}