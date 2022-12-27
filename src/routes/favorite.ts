import { Router } from 'express';
import { favoriteController } from '../controllers/favorite';
import { auth } from '../middlewares/auth';

const favoriteRoutes: Router = Router();

favoriteRoutes.get('/:id', auth.validate, favoriteController.Retrieve);

favoriteRoutes.post('/create', auth.validate, favoriteController.Create);

favoriteRoutes.patch('/:id/add_movie', auth.validate, favoriteController.AddMovie);

favoriteRoutes.delete('/:id', auth.validate, favoriteController.Delete);
