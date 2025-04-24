import { Router } from 'express';
import { collectionController } from '../controllers/collection';
import { auth } from '../middlewares/auth';

const moviesCollectionRoutes: Router = Router();

moviesCollectionRoutes.post('/create', auth.validate, collectionController.Create);
moviesCollectionRoutes.post('/create_and_add_item/owner/:owner_id', auth.validate, collectionController.CreateCollectionAndAddItem);

moviesCollectionRoutes.get('/:id', auth.validate, collectionController.RetrieveOneCollection);
moviesCollectionRoutes.get('/users/:id', auth.validate, collectionController.RetrieveUserCollections);

moviesCollectionRoutes.patch('/:id/change_title', auth.validate, collectionController.ChangeCollectionTitle);
moviesCollectionRoutes.patch('/:id/add_item', auth.validate, collectionController.AddItem);
moviesCollectionRoutes.patch('/:id/remove_item', auth.validate, collectionController.RemoveItem);

moviesCollectionRoutes.delete('/:id', auth.validate, collectionController.DeleteOneCollection);
moviesCollectionRoutes.delete('/users/:id', auth.validate, collectionController.DeleteAllUserCollections);

export { moviesCollectionRoutes };
