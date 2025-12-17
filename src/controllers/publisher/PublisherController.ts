import { Request, Response, NextFunction } from 'express';
import { PublisherService } from '../../services/PublisherService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { PublisherResponseDTO } from '../../dto/PublisherResponseDTO';

export class PublisherController {
  private publisherService = new PublisherService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const publishers = await this.publisherService.findAll();
      const dtos = publishers.map((p) => new PublisherResponseDTO(p));
      res.customSuccess(200, 'List of publishers.', dtos);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const publisher = await this.publisherService.findOne(id);
      if (!publisher) return next(new CustomError(404, 'General', `Publisher with id:${id} not found.`));
      res.customSuccess(200, 'Publisher found', new PublisherResponseDTO(publisher));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const publisher = await this.publisherService.create(req.body);
      res.customSuccess(201, 'Publisher created.', new PublisherResponseDTO(publisher));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create publisher.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const publisher = await this.publisherService.update(id, req.body);
      if (!publisher) return next(new CustomError(404, 'General', `Publisher with id:${id} not found.`));
      res.customSuccess(200, 'Publisher updated.', new PublisherResponseDTO(publisher));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      await this.publisherService.delete(id);
      res.customSuccess(200, 'Publisher deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}