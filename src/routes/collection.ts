import { Router } from 'express';
import { collectionController } from '../controllers/collection';
import { auth } from '../middlewares/auth';

const moviesCollectionRoutes: Router = Router();

moviesCollectionRoutes.post('/create', auth.validate, collectionController.Create);

moviesCollectionRoutes.get('/retrieve_many/users/:id', auth.validate, collectionController.RetrieveUserCollections);

moviesCollectionRoutes.patch('/:id/change_title', auth.validate, collectionController.ChangeCollectionTitle);
moviesCollectionRoutes.patch('/:id/add_movie', auth.validate, collectionController.AddMovie);
moviesCollectionRoutes.patch('/:id/remove_movie', auth.validate, collectionController.RemoveMovie);

moviesCollectionRoutes.delete('/:id', auth.validate, collectionController.DeleteOneCollection);
moviesCollectionRoutes.delete('/delete_many/users/:id', auth.validate, collectionController.DeleteAllUserCollections);

export { moviesCollectionRoutes };
