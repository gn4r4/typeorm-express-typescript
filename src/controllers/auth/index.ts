import { AuthController } from './AuthController';
const controller = new AuthController();
export const login = controller.login;
export const register = controller.register;
export const changePassword = controller.changePassword;