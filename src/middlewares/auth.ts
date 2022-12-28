import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { userModel } from '../models/user';

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
			const jwtDecoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY as string, {
				complete: true,
			});

			const user = await userModel.FindUserByColumn('id', jwtDecoded.payload.id);

			if (!user) return res.status(401).send({ message: 'user not found' });

			return next();
		} catch (error) {
			return res.status(401).send({
				message: 'no token or invalid token',
			});
		}
	}
}

export const auth = new Auth();
