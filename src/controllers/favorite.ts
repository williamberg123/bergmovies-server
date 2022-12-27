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
			const favorites_list = await favoriteModel.GetFavListById(Number(id));

			if (!favorites_list) {
				return res.status(400).send({
					message: 'favorite list not found',
				});
			}

			return res.status(200).json({
				favorites_list,
			});
		} catch (error) {
			return res.status(400).send({
				message: 'unexected error',
			});
		}
	}

	public async AddMovie(req: Request, res: Response) {
		const { id: favListId } = req.params;
		const { movie_id } = req.body;

		if (!favListId || !movie_id) {
			return res.status(400).send({
				message: 'missing or insuficient data',
			});
		}

		try {
			const favList = await favoriteModel.GetFavListById(Number(favListId));

			if (!favList) {
				return res.status(404).send({
					message: 'favorite list not found',
				});
			}

			const movieAlreadyOnTheList = favList.movies_list.find((m_id) => m_id === movie_id);

			if (movieAlreadyOnTheList) return res.status(409).send({ message: 'movie is already in this list' });

			const updatedFavorites = await favoriteModel.AddMovieToFavoritesList(Number(favListId), movie_id);

			if (!updatedFavorites) {
				return res.status(400).send();
			}

			return res.status(200).send();
		} catch (error) {
			return res.status(400).send({
				message: 'cannot add movie to list',
			});
		}
	}

	public async RemoveMovie(req: Request, res: Response) {
		const { id: favListId } = req.params;
		const { movie_id } = req.body;

		if (!favListId || !movie_id) {
			return res.status(400).send({
				message: 'missing or insuficient data',
			});
		}

		try {
			const favList = await favoriteModel.GetFavListById(Number(favListId));

			if (!favList) {
				return res.status(404).send({
					message: 'favorite list not found',
				});
			}

			const movieAlreadyOnTheList = favList.movies_list.find((m_id) => m_id === movie_id);

			if (!movieAlreadyOnTheList) return res.status(409).send({ message: 'movie is not on this list' });

			const updatedFavorites = await favoriteModel.RemoveMovieFromFavoritesList(Number(favListId), movie_id);

			if (!updatedFavorites) {
				return res.status(400).send();
			}

			return res.status(200).send();
		} catch (error) {
			return res.status(400).send({
				message: 'cannot add movie to list',
			});
		}
	}
}

export const favoriteController = new FavoriteController();
