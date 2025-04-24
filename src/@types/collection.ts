export interface CollectionItem {
	id: string;
	title: string;
	type: 'movie' | 'serie';
	poster_path: string;
}

export interface Collection {
	id: string;
	title: string;
	items_list: CollectionItem[];
	owner_id: string;
}

export interface CollectionWithArrayInJson {
	id: string;
	title: string;
	items_list: string[];
	owner_id: string;
}
