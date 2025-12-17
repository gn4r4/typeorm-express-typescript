import { Request, Response, NextFunction } from 'express';
import { OrdersService } from '../../services/OrdersService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { OrdersResponseDTO } from '../../dto/OrdersResponseDTO';

export class OrdersController {
  private ordersService = new OrdersService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.ordersService.findAll();
      const dtos = orders.map((o) => new OrdersResponseDTO(o));
      res.customSuccess(200, 'List of orders.', dtos);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const order = await this.ordersService.findOne(id);
      if (!order) return next(new CustomError(404, 'General', `Order with id:${id} not found.`));
      res.customSuccess(200, 'Order found', new OrdersResponseDTO(order));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // details передаються в req.body
      const order = await this.ordersService.create(req.body);
      res.customSuccess(201, 'Order created.', new OrdersResponseDTO(order));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create order.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const order = await this.ordersService.update(id, req.body);
      if (!order) return next(new CustomError(404, 'General', `Order with id:${id} not found.`));
      res.customSuccess(200, 'Order updated.', new OrdersResponseDTO(order));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      await this.ordersService.delete(id);
      res.customSuccess(200, 'Order deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}