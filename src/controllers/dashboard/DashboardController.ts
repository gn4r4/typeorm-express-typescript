import { NextFunction, Request, Response } from "express";
import { DashboardService } from "services/DashboardService";
import { CustomError } from '../../utils/response/custom-error/CustomError';

export class DashboardController {

  private dashboardService = new DashboardService();  

  public getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.dashboardService.getStats();
      res.customSuccess(200, 'dashboard stats.', stats);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  }
}