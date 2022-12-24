import { Router } from 'express';
import { userController } from '../controllers/user';

const userRoutes: Router = Router();

userRoutes.post('/', userController.CreateNewUser);

export { userRoutes };
