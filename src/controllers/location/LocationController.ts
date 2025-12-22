import { Request, Response, NextFunction } from 'express';
import { LocationService } from '../../services/LocationService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { LocationResponseDTO } from '../../dto/LocationResponseDTO';

export class LocationController {
  private locationService = new LocationService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const locations = await this.locationService.findAll();
      
      // Мапимо результат у ResponseDTO
      const responseDto = locations.map(location => new LocationResponseDTO(location));
      
      res.customSuccess(200, 'List of locations.', responseDto);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error', null, error);
      return next(customError);
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const location = await this.locationService.findOne(Number(id));
      if (!location) {
        const customError = new CustomError(404, 'General', 'Location not found');
        return next(customError);
      }
      
      const responseDto = new LocationResponseDTO(location);
      
      res.customSuccess(200, 'Location found', responseDto);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error', null, error);
      return next(customError);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Очікуємо id_shelf та quantity
      const { id_shelf, quantity } = req.body;

      if (!id_shelf) {
         return next(new CustomError(400, 'Validation', 'Shelf ID is required'));
      }

      const locations = await this.locationService.create({ 
        id_shelf: Number(id_shelf), 
        quantity: Number(quantity) 
      });
      
      // Мапимо результат у ResponseDTO
      const responseDto = locations.map(location => new LocationResponseDTO(location));
      
      res.customSuccess(201, 'Locations created.', responseDto);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error', null, error);
      return next(customError);
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const location = await this.locationService.update(Number(id), req.body);
      if (!location) {
        const customError = new CustomError(404, 'General', 'Location not found');
        return next(customError);
      }

      const responseDto = new LocationResponseDTO(location);
      
      res.customSuccess(200, 'Location updated.', responseDto);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error', null, error);
      return next(customError);
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      await this.locationService.delete(Number(id));
      res.customSuccess(200, 'Location deleted.', { id });
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error', null, error);
      return next(customError);
    }
  };
}