import {RequestHandler} from "express";
import {RolePermission} from "../role/RoleEntity";
import UserService from "./UserService";
import {SendError, SendOk} from "../helper/ResponseHelper";


class UserController {

    public get(...permission: RolePermission[]): RequestHandler {
        return (req, res) => {
            if (!req.permission || !req.permission.some((perm) => permission.includes(perm)))
                res.status(403).json({ error: "Permission denied" });

            UserService.getAllUser({__v: 0, roleId: 0, menuId: 0, password: 0})
                .then(result => SendOk(res, result))
                .catch(error => SendError(res, error))
        }
    }
}

export default new UserController();