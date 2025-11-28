import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../../services/CategoryService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export class CategoryController {
  private categoryService = new CategoryService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.findAll();
      res.customSuccess(200, 'List of categories.', categories);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const category = await this.categoryService.findOne(id);
      if (!category) return next(new CustomError(404, 'General', `Category with id:${id} not found.`));
      res.customSuccess(200, 'Category found', category);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.create(req.body);
      res.customSuccess(201, 'Category successfully created.', category);
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create category.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const category = await this.categoryService.update(id, req.body);
      if (!category) return next(new CustomError(404, 'General', `Category with id:${id} not found.`));
      res.customSuccess(200, 'Category successfully updated.', category);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const category = await this.categoryService.findOne(id);
      if (!category) return next(new CustomError(404, 'General', `Category with id:${id} not found.`));
      await this.categoryService.delete(id);
      res.customSuccess(200, 'Category successfully deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}