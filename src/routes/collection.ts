import { Router } from 'express';
import { auth } from '../middlewares/auth';

const moviesCollectionRoutes: Router = Router();

moviesCollectionRoutes.post('/create', auth.validate);

export { moviesCollectionRoutes };
