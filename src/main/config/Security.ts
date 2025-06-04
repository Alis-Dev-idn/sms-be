import {RequestHandler, Request} from "express";
import RoleModel, {hastPermission, RolePermission} from "../userManagement/role/RoleModel";
import TokenService from "../token/TokenService";
import UserModel from "../userManagement/user/UserModel";

class Security {

    private getHeaderToken(req: Request): string | undefined{
        let token = req.headers["authorization"];
        return token?.split(" ")[1];
    };

    private access(...allowRole: RolePermission[]): RequestHandler {
        return async (req, res, next) => {
            try {
                let token = this.getHeaderToken(req);
                if(!token)
                    return res.status(401).json({error: "Unauthorized"});

                const cekToken = await TokenService.isTokenValid(token);
                if(!cekToken)
                    return res.status(401).json({error: "Unauthorized"});

                if(!hastPermission(allowRole as string[], ((cekToken.idUser as UserModel).roleId as RoleModel).permissions))
                    return res.status(403).json({error: "Forbidden"});

                const idUser = (cekToken.idUser as UserModel)._id;
                req._id = idUser? idUser.toString() : undefined;
                req.permission = ((cekToken.idUser as UserModel).roleId as RoleModel).permissions;
                next();
            } catch (error) {
                console.log("Error: ", error);
                res.status(403).json({error: "Forbidden"});
            }
        }
    }

    public hasAccess(...access: RolePermission[]): RequestHandler {
        return this.access(...access);
    }

    public refreshToken(): RequestHandler {
        return async (req, res, next) => {
            try {
                let token = this.getHeaderToken(req);
                if(!token)
                    return res.status(401).json({error: "Unauthorized"});

                const cekToken = await TokenService.isTokenValid(token, true);
                if(!cekToken)
                    return res.status(401).json({error: "Unauthorized"});

                const idUser = (cekToken.idUser as UserModel)._id;
                if(!idUser)
                    return res.status(401).json({error: "Unauthorized"});
                const newToken = await TokenService.saveToken(
                    idUser,
                    "1h"
                );
                res.status(200).json({
                    token: newToken.idToken
                });
            } catch (error) {
                console.log("Error: ", error);
                res.status(500).json({error: "Internal Server Error"});
            }
        }
    }

    public revokeToken(): RequestHandler {
        return async (req, res, next) => {
            try {
                let token = this.getHeaderToken(req);
                if(!token)
                    return res.status(401).json({error: "Unauthorized"});

                await TokenService.removeToken(token);
                res.status(200).json({message: "Token revoked successfully"});
            } catch (error) {
                console.log("Error: ", error);
                res.status(500).json({error: "Internal Server Error"});
            }
        }
    }
}

export default new Security();