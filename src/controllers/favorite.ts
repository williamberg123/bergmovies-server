import { Request, Response } from 'express';
import { favoriteModel } from '../models/favorite';
import { Favorite, FavoriteItem } from '../@types/favorite';

class FavoriteController {
	public async Retrieve(req: Request, res: Response) {
		const { id } = req.params;

		if (!id) {
			return res.status(400).send({
				message: 'no data',
			});
		}

		try {
			const favorites_list = await favoriteModel.GetFavListById(id);

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

	public async AddItem(req: Request, res: Response) {
		const { id: favListId } = req.params;
		const { item }: { item: FavoriteItem } = req.body;

		if (!favListId || !item.id || !item.type) {
			return res.status(400).send({
				message: 'missing or insuficient data',
			});
		}

		try {
			const favList: Favorite | null | undefined = await favoriteModel.GetFavListById(favListId);

			if (!favList) {
				return res.status(404).send({
					message: 'favorite list not found',
				});
			}

			const movieAlreadyOnTheList = favList.items_list.find(({ id }) => id === item.id);

			if (movieAlreadyOnTheList) return res.status(409).send({ message: 'movie is already in this list' });

			const updatedFavorites = await favoriteModel.AddItemToFavoritesList(favListId, item);

			if (!updatedFavorites) {
				return res.status(400).send({
					message: 'cannot add movie to list',
				});
			}

			return res.status(200).json({
				favorites: updatedFavorites,
			});
		} catch (error) {
			return res.status(400).send({
				message: 'cannot add movie to list',
			});
		}
	}

	public async RemoveItem(req: Request, res: Response) {
		const { id: favListId } = req.params;
		const { item_id } = req.body;

		if (!favListId || !item_id) {
			return res.status(400).send({
				message: 'missing or insuficient data',
			});
		}

		try {
			const favList = await favoriteModel.GetFavListById(favListId);

			if (!favList) {
				return res.status(404).send({
					message: 'favorite list not found',
				});
			}

			const movieAlreadyOnTheList = favList.items_list.find(({ id }) => id === item_id);

			if (!movieAlreadyOnTheList) return res.status(409).send({ message: 'movie is not on this list' });

			const updatedFavorites = await favoriteModel.RemoveItemFromFavoritesList(favListId, item_id);

			if (!updatedFavorites) {
				return res.status(400).send();
			}

			return res.status(200).json({
				favorites: updatedFavorites,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).send({
				message: 'cannot remove movie to list',
			});
		}
	}
}

export const favoriteController = new FavoriteController();
