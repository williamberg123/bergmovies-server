import { User } from '../../@types/user';
import { client } from '../../lib/postgresql-client';
import { collectionModel } from '../collection';
import { favoriteModel } from '../favorite';
import { compareHashAndPassword } from './utils/compareHashAndPassword';
import { generatePasswordHash } from './utils/generateHash';

class UserModel {
	public async FindUserByColumn(columnName: string, value: string | number): Promise<User | null | undefined> {
		const response = await client.query(`
			SELECT * FROM public.users WHERE ${columnName} = '${value}'
		`);

		const user = response.rows[0];
		return user;
	}

	public async CreateNewUser(email: string, password: string): Promise<User | null | undefined> {
		try {
			await client.query('BEGIN');

			const passwordHash = await generatePasswordHash(password);

			const newUserQueryResponse = await client.query(`
				INSERT INTO public.users(email, password) VALUES ('${email}', '${passwordHash}') RETURNING *;
			`);

			const newFavorites = await favoriteModel.CreateFavoritesList();

			const newUser = newUserQueryResponse.rows[0];
			const favListId = newFavorites?.id;

			const updateNewUserQueryResponse = await client.query(`
				UPDATE public.users SET fav_list_id = '${favListId}' WHERE id = '${newUser.id}' RETURNING *;
			`);

			const updatedUser = updateNewUserQueryResponse.rows[0];

			await client.query('COMMIT');

			return updatedUser;
		} catch (error) {
			console.log(error);
			await client.query('ROLLBACK');
			return null;
		}
	}

	public async AuthenticatePassword(password: string, hash: string): Promise<boolean | undefined> {
		try {
			const isCorrectPassword = await compareHashAndPassword(password, hash);

			return isCorrectPassword;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	public async DeleteUser(id: number): Promise<User | undefined> {
		try {
			await client.query('BEGIN');

			await collectionModel.DeleteAllUserCollections(id);

			const deleteUserQueryResponse = await client.query(`
				DELETE FROM public.users WHERE id = ${id} RETURNING *;
			`);

			const deletedUser: User = deleteUserQueryResponse.rows[0];
			await favoriteModel.DeleteFavoritesList(deletedUser.fav_list_id);

			await client.query('COMMIT');

			return deletedUser;
		} catch (error) {
			await client.query('ROLLBACK');
			console.log(error);
		}
	}

	public async UpdateUserPassword(user_id: number, new_password: string): Promise<User | null | undefined> {
		try {
			const newPasswordHash = await generatePasswordHash(new_password);

			const updateUserQueryResponse = await client.query(`
				UPDATE public.users SET password = '${newPasswordHash}' WHERE id = ${user_id} RETURNING *;
			`);

			const user = updateUserQueryResponse.rows[0];

			return user;
		} catch (error) {
			console.log(error);
		}
	}
}

export const userModel = new UserModel();
