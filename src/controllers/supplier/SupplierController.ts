import { Request, Response, NextFunction } from 'express';
import { SupplierService } from '../../services/SupplierService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { SupplierResponseDTO } from '../../dto/SupplierResponseDTO';

export class SupplierController {
  private supplierService = new SupplierService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const suppliers = await this.supplierService.findAll();
      const dtos = suppliers.map((s) => new SupplierResponseDTO(s));
      res.customSuccess(200, 'List of suppliers.', dtos);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const supplier = await this.supplierService.findOne(id);
      if (!supplier) return next(new CustomError(404, 'General', `Supplier with id:${id} not found.`));
      res.customSuccess(200, 'Supplier found', new SupplierResponseDTO(supplier));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const supplier = await this.supplierService.create(req.body);
      res.customSuccess(201, 'Supplier created.', new SupplierResponseDTO(supplier));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create supplier.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const supplier = await this.supplierService.update(id, req.body);
      if (!supplier) return next(new CustomError(404, 'General', `Supplier with id:${id} not found.`));
      res.customSuccess(200, 'Supplier updated.', new SupplierResponseDTO(supplier));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const supplier = await this.supplierService.findOne(id);
      if (!supplier) return next(new CustomError(404, 'General', `Supplier with id:${id} not found.`));
      await this.supplierService.delete(id);
      res.customSuccess(200, 'Supplier deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}
