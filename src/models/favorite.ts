import { Favorite, FavoriteItem } from '../@types/favorite';
import { client } from '../database';
import { convertJsonArrayToObjectArray } from '../utils';

class FavoriteModel {
	public async GetFavListById(id: string): Promise<Favorite | null | undefined> {
		try {
			const favListQueryResponse = await client.query(`
				SELECT * FROM public.favorites WHERE id = $1;
			`, [id]);

			const favList = convertJsonArrayToObjectArray(favListQueryResponse.rows[0]);

			return favList;
		} catch (error) {
			console.log(error);
		}
	}

	public async CreateFavoritesList(): Promise<Favorite | undefined> {
		try {
			const newFavoritesQueryResponse = await client.query(`
				INSERT INTO public.favorites DEFAULT VALUES RETURNING *;
			`);

			const favList = newFavoritesQueryResponse.rows[0];

			return favList;
		} catch (error) {
			console.log(error);
		}
	}

	public async AddItemToFavoritesList(fav_id: string, item: FavoriteItem): Promise<Favorite | undefined> {
		try {
			const favList = await this.GetFavListById(fav_id);
			if (!favList) throw new Error();

			// const hasAlreadyInList = favList.items_list.find(({ id }) => id === item.id);
			// if (hasAlreadyInList) throw new Error('movie is already in this list');

			const updatedFavoritesQueryResponse = await client.query(`
				UPDATE public.favorites
				SET items_list[${favList.items_list.length + 1}] = $1
				WHERE id = $2
				RETURNING *;
			`, [item, fav_id]);

			const updatedFavorites = updatedFavoritesQueryResponse.rows[0];

			return updatedFavorites;
		} catch (error) {
			console.log(error);
		}
	}

	public async RemoveItemFromFavoritesList(fav_id: string, item_id: string): Promise<Favorite | undefined> {
		try {
			const favList = await this.GetFavListById(fav_id);
			if (!favList) throw new Error();

			// const value = arrayItem ? `ARRAY [${favList.items_list.filter(({ id }) => id !== item_id).map((i) => `'${JSON.stringify(i)}'`)}]` : 'DEFAULT';

			const updatedFavoritesList = favList.items_list.filter(({ id }) => id !== item_id);

			const updatedFavoritesQueryResponse = await client.query(`
				UPDATE public.favorites SET items_list = $1 WHERE id = $2 RETURNING *;
			`, [updatedFavoritesList, fav_id]);

			const updatedFavorites = updatedFavoritesQueryResponse.rows[0];

			return updatedFavorites;
		} catch (error) {
			console.log(error);
		}
	}

	public async DeleteFavoritesList(id: string): Promise<Favorite | undefined> {
		try {
			const deletedFavListQueryResponse = await client.query(`
				DELETE FROM public.favorites WHERE id = $1 RETURNING *;
			`, [id]);

			const deletedFavList = deletedFavListQueryResponse.rows[0];
			return deletedFavList;
		} catch (error) {
			console.log(error);
		}
	}
}

export const favoriteModel = new FavoriteModel();
