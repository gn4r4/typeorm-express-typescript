import { Request, Response, NextFunction } from 'express';
import { CabinetService } from '../../services/CabinetService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { CabinetResponseDTO } from '../../dto/CabinetResponseDTO';

export class CabinetController {
  private cabinetService = new CabinetService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cabinets = await this.cabinetService.findAll();
      const dtos = cabinets.map((c) => new CabinetResponseDTO(c));
      res.customSuccess(200, 'List of cabinets.', dtos);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const cabinet = await this.cabinetService.findOne(id);
      if (!cabinet) return next(new CustomError(404, 'General', `Cabinet with id:${id} not found.`));
      res.customSuccess(200, 'Cabinet found', new CabinetResponseDTO(cabinet));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cabinet = await this.cabinetService.create(req.body);
      res.customSuccess(201, 'Cabinet created.', new CabinetResponseDTO(cabinet));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create cabinet.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const cabinet = await this.cabinetService.update(id, req.body);
      if (!cabinet) return next(new CustomError(404, 'General', `Cabinet with id:${id} not found.`));
      res.customSuccess(200, 'Cabinet updated.', new CabinetResponseDTO(cabinet));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      await this.cabinetService.delete(id);
      res.customSuccess(200, 'Cabinet deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}