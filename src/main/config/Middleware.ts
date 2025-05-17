import UserService from "../userManagement/user/UserService";
import jsonwebtoken from "jsonwebtoken";
import {IdValidate} from "./Database";
import {Request, Response, NextFunction} from "express";
import {RolePermission} from "../userManagement/role/RoleModel";

export interface TokenPayload {
    userId: string;
    role: string;
    permissions: RolePermission[];
    exp?: number;
    iat?: number;
}

class Middleware {

    public async access(req: Request, res: Response, next: NextFunction) {
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
                return res.status(401).json({error: "Token expired"});

            if(!await UserService.getUserById(decode.userId))
                return res.status(401).json({error: "Unauthorized"});

            jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY || "", {
                algorithms: ["HS256"]
            });

            req._id = decode.userId;
            req.permission = decode.permissions as RolePermission[];
            next();
        } catch (error) {
            console.log("Error: ", error);
            res.status(403).json({error: "Forbidden"});
        }
    }
}

export default new Middleware();