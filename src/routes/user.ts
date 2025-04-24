import { Router } from 'express';
import { userController } from '../controllers/user';
import { auth } from '../middlewares/auth';

const userRoutes: Router = Router();

userRoutes.post('/register', userController.Register);
userRoutes.post('/authenticate', userController.Authenticate);

userRoutes.get('/retrieve', auth.validate, userController.Retrieve);
userRoutes.patch('/:id/update_password', auth.validate, userController.UpdateUserPassword);

userRoutes.delete('/all', userController.DeleteAll);
userRoutes.delete('/:id', auth.validate, userController.Delete);

export { userRoutes };
