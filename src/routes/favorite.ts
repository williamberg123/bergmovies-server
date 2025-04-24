import { Router } from 'express';
import { favoriteController } from '../controllers/favorite';
import { auth } from '../middlewares/auth';

const favoriteRoutes: Router = Router();

favoriteRoutes.get('/:id', auth.validate, favoriteController.Retrieve);

favoriteRoutes.patch('/:id/add_item', auth.validate, favoriteController.AddItem);
favoriteRoutes.patch('/:id/remove_item', auth.validate, favoriteController.RemoveItem);

export { favoriteRoutes };
