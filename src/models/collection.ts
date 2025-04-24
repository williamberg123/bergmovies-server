import { Collection } from '../@types/collection';
import { client } from '../database';
import { convertJsonArrayToObjectArray } from '../utils';

class CollectionModel {
	public async CreateNewCollection(ownerId: string, title: string): Promise<Collection | undefined> {
		try {
			const { rows } = await client.query(`
				INSERT INTO public.collections(title, owner_id) VALUES ($1, $2) RETURNING *;
			`, [title, ownerId]);

			return rows[0];
		} catch (error) {
			console.log(error);
		}
	}

	public async CreateCollectionAndAddItem({ ownerId, title, item }: { ownerId: string; title: string; item: Collection }): Promise<Collection | undefined> {
		try {
			await client.query('BEGIN');

			const new_collection = await this.CreateNewCollection(ownerId, title);
			const collection = await this.AddItemToCollection(new_collection?.id!, item);

			await client.query('COMMIT');

			return collection;
		} catch (error) {
			console.log(error);
			await client.query('ROLLBACK');
		}
	}

	public async FindCollectionById(id: string): Promise<Collection | undefined> {
		try {
			const { rows } = await client.query(`
				SELECT * FROM public.collections WHERE id = $1;
			`, [id]);

			const collection = convertJsonArrayToObjectArray(rows[0]);

			return collection;
		} catch (error) {
			console.log(error);
		}
	}

	public async RetrieveAllUserCollections(ownerId: string): Promise<Collection[] | undefined> {
		try {
			const { rows } = await client.query(`
				SELECT * FROM public.collections WHERE owner_id = $1 ORDER BY id ASC;
			`, [ownerId]);

			return rows;
		} catch (error) {
			console.log(error);
		}
	}

	public async ChangeCollectionTitle(id: string, newTitle: string): Promise<Collection | undefined> {
		try {
			const { rows } = await client.query(`
				UPDATE public.collections SET title = $1 WHERE id = $2 RETURNING *;
			`, [newTitle, id]);

			return rows[0];
		} catch (error) {
			console.log(error);
		}
	}

	public async AddItemToCollection(collection_id: string, item: Collection): Promise<Collection | undefined> {
		try {
			const collection = await this.FindCollectionById(collection_id) as Collection;

			const { rows } = await client.query(`
				UPDATE public.collections
				SET items_list[$1] = $2
				WHERE id = $3
				RETURNING *;
			`, [collection.items_list.length, item, collection_id]);

			return rows[0];
		} catch (error) {
			console.log(error);
		}
	}

	public async RemoveItemFromCollection(collection_id: string, movie_id: number): Promise<Collection | undefined> {
		try {
			const collection = await this.FindCollectionById(collection_id) as Collection;

			const updatedCollection = collection.items_list.filter((item) => item.id !== String(movie_id));

			const { rows } = await client.query(`
				UPDATE public.collections
				SET movies_list = $1
				WHERE id = $2
				RETURNING *;
			`, [updatedCollection, collection_id]);

			return rows[0];
		} catch (error) {
			console.log(error);
		}
	}

	public async DeleteOneCollection(id: string): Promise<Collection | undefined> {
		try {
			const { rows } = await client.query(`
				DELETE FROM public.collections WHERE id = $1 RETURNING *;
			`, [id]);

			return rows[0];
		} catch (error) {
			console.log(error);
		}
	}

	public async DeleteAllUserCollections(owner_id: string): Promise<void | undefined> {
		try {
			await client.query(`
				DELETE FROM public.collections WHERE owner_id = $1;
			`, [owner_id]);
		} catch (error) {
			console.log(error);
		}
	}
}

export const collectionModel = new CollectionModel();
