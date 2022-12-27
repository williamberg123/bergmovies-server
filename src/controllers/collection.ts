import { Request, Response } from 'express';

class CollectionController {
	public async Create(req: Request, res: Response) {
		return res.status(400).send();
	}

	public async RetrieveUserCollections(req: Request, res: Response) {
		return res.status(400).send();
	}

	public async ChangeCollectionName(req: Request, res: Response) {
		return res.status(400).send();
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
}

export const collectionController = new CollectionController();
