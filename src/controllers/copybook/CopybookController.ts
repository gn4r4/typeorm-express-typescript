import { Request, Response, NextFunction } from 'express';
import { CopybookService } from '../../services/CopybookService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { CopybookResponseDTO } from '../../dto/CopybookResponseDTO';

export class CopybookController {
  private copybookService = new CopybookService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const copybooks = await this.copybookService.findAll();
      const dtos = copybooks.map((c) => new CopybookResponseDTO(c));
      res.customSuccess(200, 'List of copybooks.', dtos);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const copybook = await this.copybookService.findOne(id);
      if (!copybook) return next(new CustomError(404, 'General', `Copybook with id:${id} not found.`));
      res.customSuccess(200, 'Copybook found', new CopybookResponseDTO(copybook));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // initialShelfId передається в req.body
      const copybook = await this.copybookService.create(req.body);
      res.customSuccess(201, 'Copybook created.', new CopybookResponseDTO(copybook));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create copybook.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const copybook = await this.copybookService.update(id, req.body);
      if (!copybook) return next(new CustomError(404, 'General', `Copybook with id:${id} not found.`));
      res.customSuccess(200, 'Copybook updated.', new CopybookResponseDTO(copybook));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      await this.copybookService.delete(id);
      res.customSuccess(200, 'Copybook deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}