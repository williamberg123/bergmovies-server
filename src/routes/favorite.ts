import { Router } from 'express';
import { favoriteController } from '../controllers/favorite';
import { auth } from '../middlewares/auth';

const favoriteRoutes: Router = Router();

favoriteRoutes.get('/:id', auth.validate, favoriteController.Retrieve);

favoriteRoutes.patch('/:id/add_movie', auth.validate, favoriteController.AddMovie);
favoriteRoutes.patch('/:id/remove_movie', auth.validate, favoriteController.RemoveMovie);

export { favoriteRoutes };
