import UserService from "../userManagement/user/UserService";
import {comparePassword, createToken} from "./AuthUtils";
import RoleModel from "../userManagement/role/RoleModel";

class AuthService {

    private userService = UserService;

    public login (
        data: { userName: string; password: string }
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const cekUser = await this.userService.getUserByUserName(data.userName);
                if (!cekUser)
                    return reject({status: 400, errorMsg: "User not found"});
                if (! await comparePassword(data.password, cekUser.password))
                    return reject({status: 400, errorMsg: "Invalid password"});
                const {password, roleId, ...user} = cekUser;
                const {_id, ...role} = roleId as RoleModel;
                const token = {
                    token: createToken({
                        userId: cekUser._id,
                        role: role.name,
                        permissions: role.permissions,
                        menuAccess: role.menuId,
                    }, process.env.JWT_EXPIRES_IN || "1"),
                    refreshToken: createToken({
                        userId: cekUser._id,
                    }, process.env.JWT_REFRESH_EXPIRES_IN || "7")
                }
                resolve(token);
            } catch (error) {
                console.log("Error: ", error);
                reject({status: 500, errorMsg: "Internal Server Error"});
            }
        });
    }
}

export default new AuthService();