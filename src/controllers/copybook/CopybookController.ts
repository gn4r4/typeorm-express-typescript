import { Request, Response, NextFunction } from 'express';
import { CopybookService } from './../../services/CopybookService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { CopybookResponseDTO } from '../../dto/CopybookResponseDTO';

export class CopybookController {
  private copybookService = new CopybookService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const copybooks = await this.copybookService.findAll();
      const responseDto = copybooks.map((cb) => new CopybookResponseDTO(cb));
      res.customSuccess(200, 'List of copybooks.', responseDto);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error', null, error);
      return next(customError);
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const copybook = await this.copybookService.findOne(Number(id));
      if (!copybook) {
        const customError = new CustomError(404, 'General', 'Copybook not found');
        return next(customError);
      }
      const responseDto = new CopybookResponseDTO(copybook);
      res.customSuccess(200, 'Copybook found', responseDto);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error', null, error);
      return next(customError);
    }
  };


  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id_edition, status, id_location } = req.body;

      if (!id_edition) {
        const customError = new CustomError(400, 'Validation', 'Поле id_edition є обов’язковим!');
        return next(customError);
      }

      const newCopybook = await this.copybookService.create({
        id_edition: Number(id_edition),
        status: status || 'доступний',
        id_location: id_location ? Number(id_location) : null 
      });

      const responseDto = new CopybookResponseDTO(newCopybook);
      res.customSuccess(201, 'Copybook created successfully.', responseDto);
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error creating copybook', null, error);
      return next(customError);
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    const { status, id_location } = req.body;

    let locationParam: number | null | undefined;

    if (id_location === null) {
      locationParam = null; // Явно передаємо null, щоб стерти локацію
    } else if (id_location !== undefined) {
      locationParam = Number(id_location); // Якщо є значення, конвертуємо в число
    }
    // Якщо id_location === undefined (не прийшло в JSON), змінна залишиться undefined

    const copybook = await this.copybookService.update(Number(id), {
      status: status, 
      id_location: locationParam // Передаємо виправлену змінну
    });

    if (!copybook) {
      const customError = new CustomError(404, 'General', 'Copybook not found');
      return next(customError);
    }

    const responseDto = new CopybookResponseDTO(copybook);
    res.customSuccess(200, 'Copybook updated.', responseDto);
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error updating copybook', null, error);
    return next(customError);
  }
};

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      await this.copybookService.delete(Number(id));
      res.customSuccess(200, 'Copybook deleted.', { id });
    } catch (error) {
      const customError = new CustomError(400, 'Raw', 'Error', null, error);
      return next(customError);
    }
  };
}