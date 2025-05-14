import {RolePermission} from "./RoleEntity";
import {RequestHandler} from "express";
import RoleService from "./RoleService";
import {SendError, SendOk} from "../helper/ResponseHelper";


class RoleController {
    public get(...permission: RolePermission[]): RequestHandler {
        return (req, res) => {
            if (!req.permission || !req.permission.some((perm) => permission.includes(perm)))
                return res.status(403).json({ error: "Permission denied" });

            RoleService.getAllRole({__v: 0, createdAt: 0, updatedAt: 0})
                .then((result) => SendOk(res, result))
                .catch((error) => SendError(res, error));
        }
    }

    public create(...permission: RolePermission[]): RequestHandler {
        return (req, res) => {
            if (!req.permission || !req.permission.some((perm) => permission.includes(perm))) {
                res.status(403).json({ error: "Permission denied" });
            } else {
                // Logic to create a role
                res.status(201).json({ message: "Role created successfully" });
            }
        }
    }
}

export default new RoleController();