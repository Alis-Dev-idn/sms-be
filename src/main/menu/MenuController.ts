import {RequestHandler} from "express";
import {RolePermission} from "../role/RoleEntity";
import MenuService from "./MenuService";
import {SendError, SendOk} from "../helper/ResponseHelper";


class MenuController {

    public get(...permission: RolePermission[]): RequestHandler {
        return (req, res) => {
            if (!req.permission || !req.permission.some((perm) => permission.includes(perm)))
                return res.status(403).json({ error: "Permission denied" });

            MenuService.getAllMenus({})
                .then((result) => SendOk(res, result))
                .catch(error => SendError(res, error));
        }
    }

    public create(...permission: RolePermission[]): RequestHandler {
        return (req, res) => {
            if (!req.permission || !req.permission.some((perm) => permission.includes(perm)))
                res.status(403).json({ error: "Permission denied" });

            MenuService.saveMenu(req.body)
                .then((result) => SendOk(res, result))
                .catch(error => SendError(res, error));
        }
    }
}

export default new MenuController();