import { Request, Response, NextFunction } from 'express';
import { ReaderService } from './../../services/ReaderService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { ReaderResponseDTO } from '../../dto/ReaderResponseDTO';

export class ReaderController {
  private readerService = new ReaderService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const readers = await this.readerService.findAll();
      const responseDto = readers.map((reader) => new ReaderResponseDTO(reader));
      res.customSuccess(200, 'List of readers.', responseDto);
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error', null, error));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const reader = await this.readerService.findOne(Number(id));
      if (!reader) {
        return next(new CustomError(404, 'General', 'Reader not found'));
      }
      res.customSuccess(200, 'Reader found', new ReaderResponseDTO(reader));
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error', null, error));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { firstname, lastname, patronymic, contact, address, id_user } = req.body;

      if (!firstname || !lastname) {
        return next(new CustomError(400, 'Validation', 'Fields firstname and lastname are required!'));
      }

      let userIdToLink = undefined;
      
      if (id_user) {
          userIdToLink = Number(id_user);
      } else if (req.jwtPayload) {
          userIdToLink = req.jwtPayload.id;
      }

      const newReader = await this.readerService.create({
        firstname,
        lastname,
        patronymic: patronymic || null,
        contact: contact || '',
        address: address || '',
      }, userIdToLink);

      res.customSuccess(201, 'Reader created successfully.', new ReaderResponseDTO(newReader));
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error creating reader', null, error));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const { firstname, lastname, patronymic, contact, address, id_user } = req.body;
      
      const updateData: any = {
        firstname, 
        lastname, 
        patronymic: patronymic || null, 
        contact, 
        address
      };

      if (id_user !== undefined) {
        updateData.id_user = id_user;
      }

      const reader = await this.readerService.update(Number(id), updateData);
      
      if (!reader) return next(new CustomError(404, 'General', 'Reader not found'));
      res.customSuccess(200, 'Reader updated successfully.', new ReaderResponseDTO(reader));
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error updating reader', null, error));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const reader = await this.readerService.findOne(Number(id));
      if (!reader) return next(new CustomError(404, 'General', 'Reader not found'));
      await this.readerService.delete(Number(id));
      res.customSuccess(200, 'Reader deleted successfully.', null);
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error deleting reader', null, error));
    }
  };
}