import { Request, Response } from 'express';
import { collectionModel } from '../models/collection';

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

	public async RetrieveUserCollections(req: Request, res: Response) {
		const { id } = req.params;

		if (!id) return res.status(400).send({ message: 'missing or insuficient data' });

		try {
			const collections = await collectionModel.RetrieveAllUserCollections(Number(id));

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
			const collection = await collectionModel.FindCollectionById(Number(id));
			if (!collection) return res.status(404).send({ message: 'collection not found' });

			const updatedCollection = await collectionModel.ChangeCollectionTitle(Number(id), new_title);

			return res.status(200).json({
				collection: updatedCollection,
			});
		} catch (error) {
			return res.status(400).send({ message: 'unexpected error' });
		}
	}

	public async AddMovie(req: Request, res: Response) {
		return res.status(400).send();
	}

	public async RemoveMovie(req: Request, res: Response) {
		return res.status(400).send();
	}

	public async DeleteOneCollection(req: Request, res: Response) {
		return res.status(400).send();
	}

	public async DeleteAllUserCollections(req: Request, res: Response) {
		return res.status(400).send();
	}
}

export const collectionController = new CollectionController();
