import {RolePermission} from "./RoleEntity";
import {RequestHandler} from "express";


class RoleController {
    public get(...permission: RolePermission[]): RequestHandler {
        return (req, res) => {
            if (!req.permission || !req.permission.some((perm) => permission.includes(perm))) {
                res.status(403).json({ error: "Permission denied" });
            } else {
                // Logic to get all roles
                res.status(200).json({ message: "All roles retrieved successfully" });
            }
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