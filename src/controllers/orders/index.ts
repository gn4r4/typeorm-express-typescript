import { OrdersController } from './OrdersController';
const controller = new OrdersController();
export const list = controller.list;
export const show = controller.show;
export const create = controller.create;
export const edit = controller.edit;
export const destroy = controller.destroy;