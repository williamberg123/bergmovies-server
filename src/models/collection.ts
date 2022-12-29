import { Collection } from '../@types/collection';
import { client } from '../lib/postgresql-client';

class CollectionModel {
	public async CreateNewCollection(ownerId: number, title: string): Promise<Collection | undefined> {
		try {
			const { rows } = await client.query(`
				INSERT INTO public.collections(title, owner_id) VALUES ('${title}', ${ownerId}) RETURNING *;
			`);

			return rows[0];
		} catch (error) {
			console.log(error);
		}
	}

	public async FindCollectionById(id: number): Promise<Collection | undefined> {
		try {
			const { rows } = await client.query(`
				SELECT * FROM public.collections WHERE id = ${id};
			`);

			return rows[0];
		} catch (error) {
			console.log(error);
		}
	}

	public async RetrieveOneCollection(id: number): Promise<Collection | undefined> {
		try {
			const { rows } = await client.query(`
				SELECT * FROM public.collections WHERE id = ${id};
			`);

			return rows[0];
		} catch (error) {
			console.log(error);
		}
	}

	public async RetrieveAllUserCollections(ownerId: number): Promise<Collection[] | undefined> {
		try {
			const { rows } = await client.query(`
				SELECT * FROM public.collections WHERE owner_id = ${ownerId} ORDER BY id ASC;
			`);

			return rows;
		} catch (error) {
			console.log(error);
		}
	}

	public async ChangeCollectionTitle(id: number, newTitle: string): Promise<Collection | undefined> {
		try {
			const { rows } = await client.query(`
				UPDATE public.collections SET title = '${newTitle}' WHERE id = ${id} RETURNING *;
			`);

			return rows[0];
		} catch (error) {
			console.log(error);
		}
	}

	public async AddMovieToCollection(collection_id: number, movie_id: string): Promise<Collection | undefined> {
		try {
			const collection = await this.FindCollectionById(collection_id) as Collection;

			const updatedCollectionMovies = [
				...collection.movies_list,
				movie_id,
			];

			const { rows } = await client.query(`
				UPDATE public.collections SET movies_list = ARRAY [${updatedCollectionMovies}] WHERE id = ${collection_id}
				RETURNING *;
			`);

			return rows[0];
		} catch (error) {
			console.log(error);
		}
	}

	public async RemoveMovieFromCollection(collection_id: number, movie_id: string): Promise<Collection | undefined> {
		try {
			const collection = await this.FindCollectionById(collection_id) as Collection;

			const updatedCollectionMovies = collection.movies_list.filter((item) => item !== movie_id);
			const value = updatedCollectionMovies.length ? `ARRAY [${updatedCollectionMovies}]` : 'DEFAULT';

			const { rows } = await client.query(`
				UPDATE public.collections
				SET movies_list = ${value}
				WHERE id = ${collection_id}
				RETURNING *;
			`);

			return rows[0];
		} catch (error) {
			console.log(error);
		}
	}

	public async DeleteOneCollection(id: number): Promise<Collection | undefined> {
		try {
			const { rows } = await client.query(`
				DELETE FROM public.collections WHERE id = ${id} RETURNING *;
			`);

			return rows[0];
		} catch (error) {
			console.log(error);
		}
	}

	public async DeleteAllUserCollections(owner_id: number): Promise<void | undefined> {
		try {
			await client.query(`
				DELETE FROM public.collections WHERE owner_id = ${owner_id};
			`);
		} catch (error) {
			console.log(error);
		}
	}
}

export const collectionModel = new CollectionModel();
