import { CategoryController } from './CategoryController';
const controller = new CategoryController();
export const list = controller.list;
export const show = controller.show;
export const create = controller.create;
export const edit = controller.edit;
export const destroy = controller.destroy;