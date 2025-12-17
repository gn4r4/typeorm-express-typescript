import { Request, Response, NextFunction } from 'express';
import { LendingService } from '../../services/LendingService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { LendingResponseDTO } from '../../dto/LendingResponseDTO';

export class LendingController {
  private lendingService = new LendingService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lendings = await this.lendingService.findAll();
      const dtos = lendings.map((l) => new LendingResponseDTO(l));
      res.customSuccess(200, 'List of lendings.', dtos);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const lending = await this.lendingService.findOne(id);
      if (!lending) return next(new CustomError(404, 'General', `Lending with id:${id} not found.`));
      res.customSuccess(200, 'Lending found', new LendingResponseDTO(lending));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // copybookIds передаються в req.body
      const lending = await this.lendingService.create(req.body);
      res.customSuccess(201, 'Lending created.', new LendingResponseDTO(lending));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create lending.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const lending = await this.lendingService.update(id, req.body);
      if (!lending) return next(new CustomError(404, 'General', `Lending with id:${id} not found.`));
      res.customSuccess(200, 'Lending updated.', new LendingResponseDTO(lending));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      await this.lendingService.delete(id);
      res.customSuccess(200, 'Lending deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}