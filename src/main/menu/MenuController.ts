import {RequestHandler} from "express";
import {RolePermission} from "../role/RoleEntity";


class MenuController {

    public get(...permission: RolePermission[]): RequestHandler {
        return (req, res) => {
            if (!req.permission || !req.permission.some((perm) => permission.includes(perm))) {
                res.status(403).json({ error: "Permission denied" });
            } else {
                // Logic to get all menus
                res.status(200).json({ message: "All menus retrieved successfully" });
            }
        }
    }

    public create(...permission: RolePermission[]): RequestHandler {
        return (req, res) => {
            if (!req.permission || !req.permission.some((perm) => permission.includes(perm))) {
                res.status(403).json({ error: "Permission denied" });
            } else {
                // Logic to create a menu
                res.status(201).json({ message: "Menu created successfully" });
            }
        }
    }
}

export default new MenuController();