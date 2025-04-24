import { User } from '../../@types/user';
import { client } from '../../database';
import { collectionModel } from '../collection';
import { favoriteModel } from '../favorite';
import { compareHashAndPassword } from './utils/compareHashAndPassword';
import { generatePasswordHash } from './utils/generateHash';

class UserModel {
	public async FindUserById(id: string): Promise<User | null | undefined> {
		const response = await client.query(`
			SELECT * FROM public.users WHERE id = $1
		`, [id]);

		const user = response.rows[0];
		return user;
	}

	public async FindUserByEmail(email: string): Promise<User | null | undefined> {
		const response = await client.query(`
			SELECT * FROM public.users WHERE email = $1
		`, [email]);

		const user = response.rows[0];
		return user;
	}

	public async CreateNewUser(email: string, password: string): Promise<User | null | undefined> {
		try {
			await client.query('BEGIN');

			const passwordHash = await generatePasswordHash(password);

			const newUserQueryResponse = await client.query(`
				INSERT INTO public.users(email, password) VALUES ($1, $2) RETURNING *;
			`, [email, passwordHash]);

			const newFavorites = await favoriteModel.CreateFavoritesList();

			const newUser = newUserQueryResponse.rows[0];
			const favListId = newFavorites?.id;

			const updateNewUserQueryResponse = await client.query(`
				UPDATE public.users SET fav_list_id = $1 WHERE id = $2 RETURNING *;
			`, [favListId, newUser.id]);

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

	public async UpdateUserPassword(user_id: string, new_password: string): Promise<User | null | undefined> {
		try {
			const newPasswordHash = await generatePasswordHash(new_password);

			const updateUserQueryResponse = await client.query(`
				UPDATE public.users SET password = $1 WHERE id = $2 RETURNING *;
			`, [newPasswordHash, user_id]);

			const user = updateUserQueryResponse.rows[0];

			return user;
		} catch (error) {
			console.log(error);
		}
	}

	public async DeleteUser(id: string): Promise<User | undefined> {
		try {
			await client.query('BEGIN');

			await collectionModel.DeleteAllUserCollections(id);

			const deleteUserQueryResponse = await client.query(`
				DELETE FROM public.users WHERE id = $1 RETURNING *;
			`, [id]);

			const deletedUser: User = deleteUserQueryResponse.rows[0];
			await favoriteModel.DeleteFavoritesList(deletedUser.fav_list_id);

			await client.query('COMMIT');

			return deletedUser;
		} catch (error) {
			await client.query('ROLLBACK');
			console.log(error);
		}
	}

	public async DeleteAllUsers(): Promise<void> {
		try {
			await client.query('DELETE FROM public.users');
		} catch (error) {
			console.log(error);
		}
	}
}

export const userModel = new UserModel();
