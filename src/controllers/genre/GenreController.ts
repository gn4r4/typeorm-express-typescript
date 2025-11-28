import { Request, Response, NextFunction } from 'express';
import { GenreService } from '../../services/GenreService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { GenreResponseDTO } from '../../dto/GenreResponseDTO';

export class GenreController {
  private genreService = new GenreService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genres = await this.genreService.findAll();
      const genresDTO = genres.map((g) => new GenreResponseDTO(g));
      
      res.customSuccess(200, 'List of genres.', genresDTO);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const genre = await this.genreService.findOne(id);
      if (!genre) return next(new CustomError(404, 'General', `Genre with id:${id} not found.`));
      
      res.customSuccess(200, 'Genre found', new GenreResponseDTO(genre));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genre = await this.genreService.create(req.body);
      res.customSuccess(201, 'Genre successfully created.', new GenreResponseDTO(genre));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create genre.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const genre = await this.genreService.update(id, req.body);
      if (!genre) return next(new CustomError(404, 'General', `Genre with id:${id} not found.`));
      
      res.customSuccess(200, 'Genre successfully updated.', new GenreResponseDTO(genre));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const genre = await this.genreService.findOne(id);
      if (!genre) return next(new CustomError(404, 'General', `Genre with id:${id} not found.`));
      
      await this.genreService.delete(id);
      res.customSuccess(200, 'Genre successfully deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}