import { Request, Response, NextFunction } from 'express';
import { CatalogService } from '../../services/CatalogService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { CatalogResponseDTO } from 'dto/CatalogResponseDTO';

export class CatalogController {
  private catalogService = new CatalogService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string | undefined;

      const editions = await this.catalogService.findAll(search);

      const responseDto = editions.map((edition) => new CatalogResponseDTO(edition));
      
      res.customSuccess(200, 'Catalog list loaded.', responseDto);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error loading catalog', null, error);
      return next(customError);
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const edition = await this.catalogService.findOne(id);
      
      if (!edition) {
        const customError = new CustomError(404, 'General', `Book with id:${id} not found.`);
        return next(customError);
      }
      
      // Перетворюємо в DTO
      const responseDto = new CatalogResponseDTO(edition);
      
      res.customSuccess(200, 'Book details found', responseDto);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error loading book details', null, error);
      return next(customError);
    }
  };
}