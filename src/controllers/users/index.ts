import { UserController } from './UserController';
const controller = new UserController();
export const list = controller.list;
export const show = controller.show;
export const edit = controller.edit;
export const destroy = controller.destroy;