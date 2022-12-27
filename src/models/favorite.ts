import { Favorite } from '../@types/favorite';
import { client } from '../lib/postgresql-client';

class FavoriteModel {
	public async GetFavListById(id: number): Promise<Favorite | null | undefined> {
		try {
			const favListQueryResponse = await client.query(`
				SELECT * FROM public.favorites WHERE id = '${id}';
			`);

			const favList = favListQueryResponse.rows[0];

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

	public async DeleteFavoritesList(id: number): Promise<Favorite | undefined> {
		try {
			const deletedFavListQueryResponse = await client.query(`
				DELETE FROM public.favorites WHERE id = '${id}' RETURNING *;
			`);

			const deletedFavList = deletedFavListQueryResponse.rows[0];
			return deletedFavList;
		} catch (error) {
			console.log(error);
		}
	}
}

export const favoriteModel = new FavoriteModel();
