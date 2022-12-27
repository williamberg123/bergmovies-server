import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { compareHashAndPassword } from '../models/user/utils/compareHashAndPassword';
import { userModel } from '../models/user';
import { User } from '../@types/user';

class UserController {
	public async Register(req: Request, res: Response) {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).send({
				message: 'no data',
			});
		}

		try {
			const hasAlreadyUsed = await userModel.FindUserByColumn('email', email);

			if (hasAlreadyUsed) {
				return res.status(409).send({
					message: 'email has already been used',
				});
			}

			const newUser = await userModel.CreateNewUser(email, password);

			if (!newUser) {
				return res.status(400).send();
			}

			return res.status(201).json({
				user: newUser,
				token: jwt.sign(newUser, process.env.JWT_SECRET_KEY as string),
			});
		} catch (error) {
			console.log(error);
			return res.status(400).send({
				message: 'unexpected error',
			});
		}
	}

	public async Authenticate(req: Request, res: Response) {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).send({
				message: 'no data',
			});
		}

		try {
			const user = await userModel.FindUserByColumn('email', email);

			if (!user) {
				return res.status(404).send({
					message: 'email or password incorrect',
				});
			}

			const hash = user.password;
			const isCorrectPassword = await userModel.AuthenticatePassword(password, hash);

			if (!isCorrectPassword) {
				return res.status(404).send({
					message: 'email or password incorrect',
				});
			}

			return res.status(200).json({
				user,
				token: jwt.sign(user, process.env.JWT_SECRET_KEY as string),
			});
		} catch (error) {
			return res.status(400).send({
				message: 'unexpected error',
			});
		}
	}

	public async Retrieve(req: Request, res: Response) {
		try {
			const { authorization } = req.headers;

			if (!authorization) {
				return res.status(401).send({
					message: 'no token',
				});
			}

			const [, token] = authorization.split(' ');

			const decodedToken = jwt.decode(token) as User | null;

			if (!decodedToken) {
				return;
			}

			const { id } = decodedToken;

			const user = await userModel.FindUserByColumn('id', id);

			return res.status(200).json({
				user,
			});
		} catch (error) {
			return res.status(401).send();
		}
	}

	public async UpdateUserPassword(req: Request, res: Response) {
		const { id } = req.params;
		const { new_password } = req.body;

		if (!id || !new_password) {
			return res.status(400).send({
				message: 'no data',
			});
		}

		try {
			const user = await userModel.FindUserByColumn('id', id);

			if (!user) {
				return res.status(409).send({
					message: 'user not found',
				});
			}

			const isSamePassword = await compareHashAndPassword(new_password, user.password);

			if (isSamePassword) {
				return res.status(409).send({
					message: 'new password is same as old password',
				});
			}

			const updatedUser = await userModel.UpdateUserPassword(Number(id), new_password);

			if (!updatedUser) {
				return res.status(400).send();
			}

			return res.status(200).json({
				user: updatedUser,
				token: jwt.sign(updatedUser, process.env.JWT_SECRET_KEY as string),
			});
		} catch (error) {
			return res.status(400).send({
				message: 'unexpected error',
			});
		}
	}

	public async Delete(req: Request, res: Response) {
		const { id } = req.params;

		if (!id) {
			return res.status(400).send({
				message: 'no data',
			});
		}

		const user = await userModel.FindUserByColumn('id', id);

		if (!user) {
			return res.status(409).send({
				message: 'user not found',
			});
		}

		const deletedUser = await userModel.DeleteUser(Number(id));

		if (!deletedUser) {
			return res.status(400).send({
				message: 'cannot delete user',
			});
		}

		return res.status(200).send();
	}
}

export const userController = new UserController();
