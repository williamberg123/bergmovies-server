import { Favorite } from '../@types/favorite';
import { client } from '../lib/postgresql-client';

class FavoriteModel {
	public async GetFavListById(id: number): Promise<Favorite | null | undefined> {
		try {
			const favListQueryResponse = await client.query(`
				SELECT * FROM public.favorites WHERE id = ${id};
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

	public async AddMovieToFavoritesList(fav_id: number, movie_id: string): Promise<Favorite | undefined> {
		try {
			await client.query('BEGIN');

			const favList = await this.GetFavListById(fav_id);

			if (!favList) throw new Error();

			const updatedMoviesList = [
				...favList.movies_list,
				movie_id,
			];

			const updatedFavoritesQueryResponse = await client.query(`
				UPDATE public.favorites SET movies_list = ARRAY [${updatedMoviesList}] WHERE id = ${fav_id} RETURNING *;
			`);

			const updatedFavorites = updatedFavoritesQueryResponse.rows[0];

			await client.query('COMMIT');

			return updatedFavorites;
		} catch (error) {
			await client.query('ROLLBACK');
			console.log(error);
		}
	}

	public async RemoveMovieFromFavoritesList(fav_id: number, movie_id: string): Promise<Favorite | undefined> {
		try {
			await client.query('BEGIN');

			const favList = await this.GetFavListById(fav_id);

			if (!favList) throw new Error();

			const updatedMoviesList = favList.movies_list.filter((item) => item !== movie_id);

			const updatedFavoritesQueryResponse = await client.query(`
				UPDATE public.favorites SET movies_list = ARRAY [${updatedMoviesList}] WHERE id = ${fav_id} RETURNING *;
			`);

			const updatedFavorites = updatedFavoritesQueryResponse.rows[0];

			await client.query('COMMIT');

			return updatedFavorites;
		} catch (error) {
			await client.query('ROLLBACK');
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
