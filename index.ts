import dotenv from 'dotenv';

dotenv.config();

import { App } from './src/app';

new App().server.listen(5555, async () => {
	console.log('running: http://localhost:5555/');
});
