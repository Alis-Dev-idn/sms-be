import Token, {IToken} from "./Token";
import jsonwebtoken from "jsonwebtoken";
import mongoose, {DeleteResult, Model, Schema} from "mongoose";
import UserModel from "../userManagement/user/UserModel";
import UserService from "../userManagement/user/UserService";


export default new class TokenService {
    private model: Model<IToken> = Token;

    private expIn(time: string): number {
        const match = time.match(/^(\d+)([hdm])$/); // Regex untuk format waktu
        if (!match)
            return 0;

        const value = parseInt(match[1], 10);
        const unit = match[2];

        let seconds: number = 0;
        switch (unit) {
            case 'h': seconds = value * 3600; break; // Jam ke detik
            case 'd': seconds = value * 86400; break; // Hari ke detik
            case 'm': seconds = value * 60; break; // Menit ke detik
            default: break;
        }

        return seconds;
    }

    private async createToken(idUser: Schema.Types.ObjectId, exp: string): Promise<IToken> {
        const token = jsonwebtoken.sign({
            exp: Math.floor(Date.now() / 1000) + this.expIn(exp),
        }, process.env.JWT_SECRET_KEY || "", {
            algorithm: "HS256",
        });
        const refreshToken = jsonwebtoken.sign({
            exp: Math.floor(Date.now() / 1000) + this.expIn("7d"), // Default refresh token expires in 7 days
        }, process.env.JWT_SECRET_KEY || "", {
            algorithm: "HS256",
        })

        const cekDb = await this.model.findOne({idUser: idUser}).exec();
        if(cekDb) {
            cekDb.idToken = new mongoose.Types.ObjectId().toString();
            cekDb.tokenValue = token;
            cekDb.refreshTokenValue = refreshToken;
            return cekDb.save();
        }

        return this.model.create({
            idToken: new mongoose.Types.ObjectId().toString(),
            idUser: idUser,
            tokenValue: token,
            refreshTokenValue: refreshToken
        });
    }

    private async getToken(idToken: string): Promise<IToken | null> {
        return this.model.findOne({idToken: idToken}).populate({
            path: 'idUser',
            populate: "roleId",
        }).exec();
    }

    public async removeToken(idToken: string): Promise<DeleteResult> {
        return this.model.deleteOne({idToken: idToken})
    }

    public async saveToken(idUser: Schema.Types.ObjectId, exp: string): Promise<IToken> {
        return this.createToken(idUser, exp);
    }

    public async isTokenValid(idToken: string, isRefresh?: boolean): Promise<IToken | null> {
        try {
            const cekToken = await this.getToken(idToken);
            if(!cekToken)
                return null;
            const userId = (cekToken.idUser as UserModel)._id;
            const cekUser = await UserService.getUserById(userId? userId.toString() : "");
            if(!cekUser)
                return null;

            const decoded = jsonwebtoken.decode(
                isRefresh? cekToken.refreshTokenValue : cekToken.tokenValue
            ) as {exp: number};
            if(!decoded)
                return null;
            if(decoded.exp < Math.floor(Date.now() / 1000))
                return null;
            jsonwebtoken.verify(
                isRefresh? cekToken.refreshTokenValue : cekToken.tokenValue,
                process.env.JWT_SECRET_KEY || "", {
                algorithms: ["HS256"]
            });
            return isRefresh? this.model.findOneAndUpdate(
                {idToken: idToken}, {
                    idToken: cekToken.idToken,
                    idUser: (cekToken.idUser as UserModel)._id,
                    tokenValue: jsonwebtoken.sign({
                        exp: Math.floor(Date.now() / 1000) + this.expIn("1h"), // Default token expires in 1 hour
                    }, process.env.JWT_SECRET_KEY || "", {
                        algorithm: "HS256",
                    }),
                    refreshTokenValue: cekToken.refreshTokenValue
                }) : cekToken;
        } catch (err) {
            return  null;
        }
    }
}