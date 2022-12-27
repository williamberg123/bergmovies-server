import bcrypt from 'bcrypt';

export const generatePasswordHash = async (password: string) => {
	try {
		const hash = await bcrypt.hash(password, 10);
		return hash;
	} catch (error) {
		console.log(error);
	}
};
