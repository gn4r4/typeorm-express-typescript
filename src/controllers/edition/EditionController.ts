import { Request, Response, NextFunction } from 'express';
import { EditionService } from '../../services/EditionService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { EditionResponseDTO } from '../../dto/EditionResponseDTO';

export class EditionController {
  private editionService = new EditionService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const editions = await this.editionService.findAll();
      const dtos = editions.map((e) => new EditionResponseDTO(e));
      res.customSuccess(200, 'List of editions.', dtos);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const edition = await this.editionService.findOne(id);
      if (!edition) return next(new CustomError(404, 'General', `Edition with id:${id} not found.`));
      res.customSuccess(200, 'Edition found', new EditionResponseDTO(edition));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const edition = await this.editionService.create(req.body);
      res.customSuccess(201, 'Edition created.', new EditionResponseDTO(edition));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create edition.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const edition = await this.editionService.update(id, req.body);
      if (!edition) return next(new CustomError(404, 'General', `Edition with id:${id} not found.`));
      res.customSuccess(200, 'Edition updated.', new EditionResponseDTO(edition));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      await this.editionService.delete(id);
      res.customSuccess(200, 'Edition deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}