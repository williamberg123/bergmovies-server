import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

class Auth {
	public async validate(req: Request, res: Response, next: NextFunction) {
		const { authorization } = req.headers;

		if (!authorization) {
			return res.status(401).send({
				message: 'no token',
			});
		}

		const [, token] = authorization.split(' ');

		try {
			jwt.verify(token, process.env.JWT_SECRET_KEY as string, {
				complete: true,
			});

			return next();
		} catch (error) {
			return res.status(401).send({
				message: 'no token or invalid token',
			});
		}
	}
}

export const auth = new Auth();
