import { Request, Response, NextFunction } from 'express';
import { AuthorService } from '../../services/AuthorService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { AuthorResponseDTO } from '../../dto/AuthorResponseDTO';

export class AuthorController {
  private authorService = new AuthorService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authors = await this.authorService.findAll();
      const authorsDTO = authors.map((author) => new AuthorResponseDTO(author));
      
      res.customSuccess(200, 'List of authors.', authorsDTO);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const author = await this.authorService.findOne(id);
      if (!author) return next(new CustomError(404, 'General', `Author with id:${id} not found.`));
      
      res.customSuccess(200, 'Author found', new AuthorResponseDTO(author));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const author = await this.authorService.create(req.body);
      res.customSuccess(201, 'Author successfully created.', new AuthorResponseDTO(author));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create author.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const author = await this.authorService.update(id, req.body);
      if (!author) return next(new CustomError(404, 'General', `Author with id:${id} not found.`));
      
      res.customSuccess(200, 'Author successfully updated.', new AuthorResponseDTO(author));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const author = await this.authorService.findOne(id);
      if (!author) return next(new CustomError(404, 'General', `Author with id:${id} not found.`));
      
      await this.authorService.delete(id);
      res.customSuccess(200, 'Author successfully deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}