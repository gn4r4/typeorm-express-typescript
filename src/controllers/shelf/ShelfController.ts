import { Request, Response, NextFunction } from 'express';
import { ShelfService } from '../../services/ShelfService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { ShelfResponseDTO } from '../../dto/ShelfResponseDTO';

export class ShelfController {
  private shelfService = new ShelfService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shelves = await this.shelfService.findAll();
      const dtos = shelves.map((s) => new ShelfResponseDTO(s));
      res.customSuccess(200, 'List of shelves.', dtos);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const shelf = await this.shelfService.findOne(id);
      if (!shelf) return next(new CustomError(404, 'General', `Shelf with id:${id} not found.`));
      res.customSuccess(200, 'Shelf found', new ShelfResponseDTO(shelf));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shelf = await this.shelfService.create(req.body);
      res.customSuccess(201, 'Shelf created.', new ShelfResponseDTO(shelf));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create shelf.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const shelf = await this.shelfService.update(id, req.body);
      if (!shelf) return next(new CustomError(404, 'General', `Shelf with id:${id} not found.`));
      res.customSuccess(200, 'Shelf updated.', new ShelfResponseDTO(shelf));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      await this.shelfService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}