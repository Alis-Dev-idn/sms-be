import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

export const hastPassword = async (password: string) => {
    const genSalt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, genSalt);
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
}

export const createToken = (payload: any, expiresIn: string): string => {
    return jsonwebtoken.sign({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * parseInt(expiresIn)),
    }, process.env.JWT_SECRET_KEY || "", {
        algorithm: "HS256",
    });
}
