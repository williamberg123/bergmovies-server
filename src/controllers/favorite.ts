import { Request, Response } from 'express';
import { favoriteModel } from '../models/favorite';

class FavoriteController {
	public async Retrieve(req: Request, res: Response) {
		const { id } = req.params;

		if (!id) {
			return res.status(400).send({
				message: 'no data',
			});
		}

		try {
			const favorite = await favoriteModel.GetFavListById(Number(id));

			if (!favorite) {
				return res.status(400).send({
					message: 'favorite list not found',
				});
			}

			return res.status(200).json({
				favorite,
			});
		} catch (error) {
			return res.status(400).send({
				message: 'unexected error',
			});
		}
	}

	public async Create(req: Request, res: Response) {
		return res.status(200).send();
	}

	public async AddMovie(req: Request, res: Response) {
		return res.status(200).send();
	}

	public async Delete(req: Request, res: Response) {
		return res.status(200).send();
	}
}

export const favoriteController = new FavoriteController();
