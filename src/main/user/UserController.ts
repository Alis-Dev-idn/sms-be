import {RequestHandler} from "express";
import {RolePermission} from "../role/RoleEntity";


class UserController {

    public get(...permission: RolePermission[]): RequestHandler {
        return (req, res) => {
            if (!req.permission || !req.permission.some((perm) => permission.includes(perm))) {
                res.status(403).json({ error: "Permission denied" });
            } else {
                // Logic to get all users
                res.status(200).json({ message: "All users retrieved successfully" });
            }
        }
    }
}

export default new UserController();