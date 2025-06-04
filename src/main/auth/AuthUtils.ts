import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

export const hastPassword = async (password: string) => {
    const genSalt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, genSalt);
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
}
