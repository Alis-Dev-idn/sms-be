import UserService from "../userManagement/user/UserService";
import {comparePassword, createToken} from "./AuthUtils";
import TokenService from "../token/TokenService";

class AuthService {

    private userService = UserService;

    public login (
        data: { userName: string; password: string }
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const cekUser = await this.userService.getUserByUserName(data.userName);
                if (!cekUser || !cekUser._id)
                    return reject({status: 400, errorMsg: "User not found"});
                if (! await comparePassword(data.password, cekUser.password))
                    return reject({status: 400, errorMsg: "Invalid password or username"});

                const tokens = await TokenService.saveToken(
                    cekUser._id,
                    "1h"
                );
                resolve({
                    token: tokens.idToken
                });
            } catch (error) {
                console.log("Error: ", error);
                reject({status: 500, errorMsg: "Internal Server Error"});
            }
        });
    }
}

export default new AuthService();
