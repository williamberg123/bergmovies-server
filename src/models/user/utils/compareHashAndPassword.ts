import bcrypt from 'bcrypt';

export const compareHashAndPassword = async (password: string, hash: string): Promise<boolean | undefined> => {
	try {
		const isCorrectPassword = await bcrypt.compare(password, hash);
		return isCorrectPassword;
	} catch (error) {
		console.log(error);
	}
};
