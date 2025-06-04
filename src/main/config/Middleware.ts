import UserService from "../userManagement/user/UserService";
import jsonwebtoken from "jsonwebtoken";
import {IdValidate} from "./Database";
import {RequestHandler} from "express";
import RoleModel, {hastPermission, RolePermission} from "../userManagement/role/RoleModel";

export interface TokenPayload {
    userId: string;
    role: string;
    permissions: RolePermission[];
    exp?: number;
    iat?: number;
}

class Middleware {

    private access(...allowRole: RolePermission[]): RequestHandler {
        return async (req, res, next) => {
            try {
                let token = req.headers["authorization"];
                if(!token)
                    return res.status(401).json({error: "Unauthorized"});
                token = token.split(" ")[1];

                const decode = jsonwebtoken.decode(token) as TokenPayload;
                if(decode === null)
                    return res.status(401).json({error: "Unauthorized"});

                if(!IdValidate(decode.userId))
                    return res.status(401).json({error: "Unauthorized"});

                if(decode.exp && decode.exp < Math.floor(Date.now() / 1000))
                    return res.status(401).json({error: "Token expired or not valid"});

                const cekUser = await UserService.getUserById(decode.userId)

                if(!cekUser)
                    return res.status(401).json({error: "Unauthorized"});

                jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY || "", {
                    algorithms: ["HS256"]
                });

                if(!hastPermission(allowRole as string[], (cekUser.roleId as RoleModel).permissions))
                    return res.status(403).json({error: "Forbidden"});

                req._id = cekUser._id? cekUser._id.toString() : undefined;
                req.permission = (cekUser.roleId as RoleModel).permissions;
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
}

export default new Middleware();