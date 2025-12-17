import { PublisherController } from './PublisherController';
const controller = new PublisherController();
export const list = controller.list;
export const show = controller.show;
export const create = controller.create;
export const edit = controller.edit;
export const destroy = controller.destroy;