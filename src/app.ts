import express from 'express';
import cors from 'cors';
import logger from 'morgan';

import { userRoutes } from './routes/user';
import { favoriteRoutes } from './routes/favorite';
import { moviesCollectionRoutes } from './routes/collection';
import { connectDb } from './lib/postgresql-client';

export class App {
	public server: express.Application;

	constructor() {
		this.server = express();
		this.middleware();
	}

	private async middleware() {
		await connectDb();

		this.server.use(cors());
		this.server.use(logger('dev'));
		this.server.use(express.json());
		this.server.use(express.urlencoded({ extended: false }));

		this.routes();
	}

	private routes() {
		this.server.use('/v1/users', userRoutes);
		this.server.use('/v1/favorites', favoriteRoutes);
		this.server.use('/v1/collections', moviesCollectionRoutes);
	}
}
