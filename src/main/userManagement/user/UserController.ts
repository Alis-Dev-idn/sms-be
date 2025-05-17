import {Router} from "express";
import UserService from "./UserService";
import {SendError, SendOk} from "../../helper/ResponseHelper";
import {HasPermission} from "../role/RoleModel";

const router = Router();

export default (): Router => {
    /**
     * @swagger
     * /user:
     *   get:
     *     summary: Get all users
     *     tags:
     *       - User
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Daftar semua user
     */
    router.get("/", (req, res) => {
        if (!req.permission)
            return res.status(403).json({error: "Permission denied"});

        if (!HasPermission(req.permission))
            return res.status(403).json({error: "Permission denied"});

        UserService.getAllUser({__v: 0, roleId: 0, menuId: 0, password: 0})
            .then(result => SendOk(res, result))
            .catch(error => SendError(res, error))
    });

    return router;
}