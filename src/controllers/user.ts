import { Request, Response } from 'express';

class UserController {
	public CreateNewUser(req: Request, res: Response) {
		return res.json({
			user: {
				name: 'William Berg',
				age: 18
			}
		});
	}
}

export const userController = new UserController();
