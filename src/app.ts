import express from 'express';
import cors from 'cors';

import { userRoutes } from './routes/user';

export class App {
	public server: express.Application;

	constructor() {
		this.server = express();
		this.middleware();
		this.routes();
	}

	private middleware() {
		this.server.use(cors())
		this.server.use(express.json());
	}

	private routes() {
		this.server.use('/users', userRoutes);
	}
}
