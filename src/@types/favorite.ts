export interface FavoriteItem {
	id: string;
	title: string;
	type: 'movie' | 'serie';
	backdrop_path: string;
}

export interface Favorite {
	id: string;
	items_list: FavoriteItem[];
}

export interface FavoriteWithArrayInJson {
	id: string;
	items_list: string[];
}
