import {Router} from "express";
import UserService from "./UserService";
import {SendError, SendOk} from "../../helper/ResponseHelper";
import {HasPermission, RolePermission} from "../role/RoleModel";

const router = Router();

export default (): Router => {
    /**
     * @swagger
     * /user:
     *   get:
     *     summary: Get all users
     *     tags:
     *       - Get-Users
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Daftar semua user
     */
    router.get("/", (req, res) => {
        // if (!req.permission || !req.permission.some((perm) => permission.includes(perm)))
        //     res.status(403).json({ error: "Permission denied" });

        if (!req.permission)
            return res.status(403).json({error: "Permission denied"});

        if (!HasPermission(req.permission, RolePermission.READ))
            return res.status(403).json({error: "Permission denied"});

        UserService.getAllUser({__v: 0, roleId: 0, menuId: 0, password: 0})
            .then(result => SendOk(res, result))
            .catch(error => SendError(res, error))
    });

    return router;
}