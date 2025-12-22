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
      const customError = new CustomError(400, 'Raw', 'Error', null, error);
      return next(customError);
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const reader = await this.readerService.findOne(Number(id));
      if (!reader) {
        const customError = new CustomError(404, 'General', 'Reader not found');
        return next(customError);
      }
      const responseDto = new ReaderResponseDTO(reader);
      res.customSuccess(200, 'Reader found', responseDto);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error', null, error);
      return next(customError);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstname, lastname, patronymic, contact, address } = req.body;

      if (!firstname || !lastname) {
        const customError = new CustomError(400, 'Validation', 'Fields firstname and lastname are required!');
        return next(customError);
      }

      const newReader = await this.readerService.create({
        firstname,
        lastname,
        patronymic: patronymic || null,
        contact: contact || '',
        address: address || '',
      });

      const responseDto = new ReaderResponseDTO(newReader);
      res.customSuccess(201, 'Reader created successfully.', responseDto);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error creating reader', null, error);
      return next(customError);
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const { firstname, lastname, patronymic, contact, address } = req.body;

      const reader = await this.readerService.update(Number(id), {
        firstname,
        lastname,
        patronymic: patronymic || null,
        contact,
        address,
      });

      if (!reader) {
        const customError = new CustomError(404, 'General', 'Reader not found');
        return next(customError);
      }

      const responseDto = new ReaderResponseDTO(reader);
      res.customSuccess(200, 'Reader updated successfully.', responseDto);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error updating reader', null, error);
      return next(customError);
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const reader = await this.readerService.findOne(Number(id));

      if (!reader) {
        const customError = new CustomError(404, 'General', 'Reader not found');
        return next(customError);
      }

      await this.readerService.delete(Number(id));
      res.customSuccess(200, 'Reader deleted successfully.', null);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error deleting reader', null, error);
      return next(customError);
    }
  };
}
