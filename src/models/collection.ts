import { Collection } from '../@types/collection';
import { client } from '../lib/postgresql-client';

class CollectionModel {
	public async CreateNewCollection(ownerId: number, title: string): Promise<Collection | undefined> {
		try {
			const newCollectionQueryResponse = await client.query(`
				INSERT INTO public.collections(title, owner_id) VALUES ('${title}', ${ownerId}) RETURNING *;
			`);

			const newCollection = newCollectionQueryResponse.rows[0];
			return newCollection;
		} catch (error) {
			console.log(error);
		}
	}

	public async FindCollectionById(id: number) {
		try {
			const collectionQueryResponse = await client.query(`
				SELECT * FROM public.collections WHERE id = ${id};
			`);

			const collection = collectionQueryResponse.rows[0];

			return collection;
		} catch (error) {
			console.log(error);
		}
	}

	public async RetrieveAllUserCollections(ownerId: number): Promise<Collection[] | undefined> {
		try {
			const userCollectionsQueryResponse = await client.query(`
				SELECT * FROM public.collections WHERE owner_id = ${ownerId} ORDER BY id ASC;
			`);

			const userCollections = userCollectionsQueryResponse.rows;

			return userCollections;
		} catch (error) {
			console.log(error);
		}
	}

	public async ChangeCollectionTitle(id: number, newTitle: string) {
		try {
			const collectionQueryResponse = await client.query(`
				UPDATE public.collections SET title = '${newTitle}' WHERE id = ${id} RETURNING *;
			`);

			const updatedCollection = collectionQueryResponse.rows[0];

			return updatedCollection;
		} catch (error) {
			console.log(error);
		}
	}
}

export const collectionModel = new CollectionModel();
