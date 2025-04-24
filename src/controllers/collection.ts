import { Request, Response } from 'express';
import { collectionModel } from '../models/collection';
import { Collection } from '../@types/collection';

class CollectionController {
	public async Create(req: Request, res: Response) {
		const { user_id, title } = req.body;

		if (!user_id || !title) return res.status(404).send({ message: 'missing or insuficient data' });

		try {
			const new_collection = await collectionModel.CreateNewCollection(user_id, title);

			if (!new_collection) return res.status(400).send({ message: 'cannot create a new collection' });

			return res.status(200).json({ new_collection });
		} catch (error) {
			return res.status(400).send({ message: 'unexpected error' });
		}
	}

	public async CreateCollectionAndAddItem(req: Request, res: Response) {
		const { item, collection_title } = req.body;
		const { owner_id } = req.params;

		if (!item || !owner_id || !collection_title) return res.status(404).send({ message: 'missing or insuficient data' });

		try {
			const collection = await collectionModel.CreateCollectionAndAddItem({
				ownerId: owner_id, title: collection_title, item,
			});

			if (!collection) return res.status(400).send({ message: 'cannot create a new collection' });

			return res.status(200).json({ collection });
		} catch (error) {
			return res.status(400).send({ message: 'unexpected error' });
		}
	}

	public async RetrieveOneCollection(req: Request, res: Response) {
		const { id } = req.params;

		if (!id) return res.status(400).send({ message: 'missing or insuficient data' });

		try {
			const collection = await collectionModel.FindCollectionById(id);

			if (!collection) return res.status(404).send({ message: 'collection not found' });

			return res.status(200).json({
				collection,
			});
		} catch (error) {
			return res.status(400).send({ message: 'unexpected error' });
		}
	}

	public async RetrieveUserCollections(req: Request, res: Response) {
		const { id } = req.params;

		if (!id) return res.status(400).send({ message: 'missing or insuficient data' });

		try {
			const collections = await collectionModel.RetrieveAllUserCollections(id);

			return res.status(200).json({ collections });
		} catch (error) {
			return res.status(400).send({ message: 'unexpected error' });
		}
	}

	public async ChangeCollectionTitle(req: Request, res: Response) {
		const { id } = req.params;
		const { new_title } = req.body;

		if (!id || !new_title) return res.status(400).send({ message: 'missing or insuficient data' });

		try {
			const collection = await collectionModel.FindCollectionById(id);
			if (!collection) return res.status(404).send({ message: 'collection not found' });

			const updatedCollection = await collectionModel.ChangeCollectionTitle(id, new_title);

			return res.status(200).json({
				collection: updatedCollection,
			});
		} catch (error) {
			return res.status(400).send({ message: 'unexpected error' });
		}
	}

	public async AddItem(req: Request, res: Response) {
		const { id: collectionId } = req.params;
		const { item }: { item: Collection } = req.body;

		if (!collectionId || !item.id) return res.status(400).send({ message: 'missing or insuficient data' });

		try {
			const collection = await collectionModel.FindCollectionById(collectionId);
			if (!collection) return res.status(400).send({ message: 'collection not found' });

			const alreadyMovieOnTheList = collection.items_list.find(({ id }) => Number(id) === Number(item.id));
			if (alreadyMovieOnTheList) return res.status(409).send({ message: 'item is already on the list' });

			const updatedCollection = await collectionModel.AddItemToCollection(collectionId, item);

			return res.status(200).json({
				collection: updatedCollection,
			});
		} catch (error) {
			return res.status(400).send({ message: 'unexpected error' });
		}
	}

	public async RemoveItem(req: Request, res: Response) {
		const { id } = req.params;
		const { movie_id } = req.body;

		if (!id || !movie_id) return res.status(400).send({ message: 'missing or insuficient data' });

		try {
			const collection = await collectionModel.FindCollectionById(id);
			if (!collection) return res.status(400).send({ message: 'collection not found' });

			const alreadyMovieOnTheList = collection.items_list.find((item) => item === movie_id);
			if (!alreadyMovieOnTheList) return res.status(409).send({ message: 'movie is not on the list' });

			const updatedCollection = await collectionModel.RemoveItemFromCollection(id, movie_id);

			return res.status(200).json({
				collection: updatedCollection,
			});
		} catch (error) {
			return res.status(400).send({ message: 'unexpected error' });
		}
	}

	public async DeleteOneCollection(req: Request, res: Response) {
		const { id } = req.params;
		console.log('id', id);

		if (!id) return res.status(400).send({ message: 'missing or insuficient data' });

		try {
			// const collection = await collectionModel.FindCollectionById(Number(id));

			// if (!collection) return res.status(400).send({ message: 'collection not found' });

			await collectionModel.DeleteOneCollection(id);

			return res.status(200).send();
		} catch (error) {
			return res.status(400).send({ message: 'unexpected error' });
		}
	}

	public async DeleteAllUserCollections(req: Request, res: Response) {
		const { id } = req.params;

		if (!id) return res.status(400).send({ message: 'missing or insuficient data' });

		try {
			await collectionModel.DeleteAllUserCollections(id);

			return res.status(200).send();
		} catch (error) {
			return res.status(400).send({ message: 'unexpected error' });
		}
	}
}

export const collectionController = new CollectionController();
