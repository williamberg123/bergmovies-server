import { NextFunction, Request, Response } from 'express';

export const cors = (req: Request, res: Response, next: NextFunction) => {
	const allowedOrigins = [
		'http://localhost:3000',
		'http://10.0.0.106:3000',
		'https://bergmovies.vercel.app/',
	];

	const origin = req.header('origin');
	const isAllowed = allowedOrigins.includes(origin!);

	if (isAllowed) {
		res.setHeader('Access-Control-Allow-Origin', origin!);
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Headers', '*');
		res.setHeader('Access-Control-Max-Age', '*');
	}

	next();
};
