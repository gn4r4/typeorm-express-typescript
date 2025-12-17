import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../../services/EmployeeService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { EmployeeResponseDTO } from '../../dto/EmployeeResponseDTO';

export class EmployeeController {
  private employeeService = new EmployeeService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employees = await this.employeeService.findAll();
      const dtos = employees.map((e) => new EmployeeResponseDTO(e));
      res.customSuccess(200, 'List of employees.', dtos);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const employee = await this.employeeService.findOne(id);
      if (!employee) return next(new CustomError(404, 'General', `Employee with id:${id} not found.`));
      res.customSuccess(200, 'Employee found', new EmployeeResponseDTO(employee));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await this.employeeService.create(req.body);
      res.customSuccess(201, 'Employee created.', new EmployeeResponseDTO(employee));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create employee.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const employee = await this.employeeService.update(id, req.body);
      if (!employee) return next(new CustomError(404, 'General', `Employee with id:${id} not found.`));
      res.customSuccess(200, 'Employee updated.', new EmployeeResponseDTO(employee));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      await this.employeeService.delete(id);
      res.customSuccess(200, 'Employee deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}