CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS favorites (
	id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
	items_list TEXT[] DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE IF NOT EXISTS users (
	id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
	email VARCHAR NOT NULL UNIQUE,
	password VARCHAR,
	fav_list_id UUID,
	FOREIGN KEY(fav_list_id) REFERENCES favorites(id)
);

CREATE TABLE IF NOT EXISTS collections (
	id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
	title VARCHAR NOT NULL,
	owner_id UUID,
	items_list TEXT[] DEFAULT ARRAY[]::TEXT[],
	FOREIGN KEY(owner_id) REFERENCES users(id)
);
