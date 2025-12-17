import { Request, Response, NextFunction } from 'express';
import { PositionService } from '../../services/PositionService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { PositionResponseDTO } from '../../dto/PositionResponseDTO';

export class PositionController {
  private positionService = new PositionService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const positions = await this.positionService.findAll();
      const dtos = positions.map((p) => new PositionResponseDTO(p));
      res.customSuccess(200, 'List of positions.', dtos);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const position = await this.positionService.findOne(id);
      if (!position) return next(new CustomError(404, 'General', `Position with id:${id} not found.`));
      res.customSuccess(200, 'Position found', new PositionResponseDTO(position));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const position = await this.positionService.create(req.body);
      res.customSuccess(201, 'Position created.', new PositionResponseDTO(position));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create position.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const position = await this.positionService.update(id, req.body);
      if (!position) return next(new CustomError(404, 'General', `Position with id:${id} not found.`));
      res.customSuccess(200, 'Position updated.', new PositionResponseDTO(position));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      await this.positionService.delete(id);
      res.customSuccess(200, 'Position deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}