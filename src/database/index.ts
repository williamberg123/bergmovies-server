import { Client } from 'pg';

export const client = new Client({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: Number(process.env.PGPORT),
	connectionString: process.env.PGCONNECTIONSTRING,
});

export const connectDb = async () => {
	try {
		await client.connect();
	} catch (error) {
		console.log(error);
	}
};
