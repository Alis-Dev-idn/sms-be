import {Router} from "express";
import UserService from "./UserService";
import {SendError, SendOk} from "../../helper/ResponseHelper";
import {HasPermission, RolePermission} from "../role/RoleModel";
import Middleware from "../../config/Middleware";

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
     *         content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      data:
     *                          type: array
     *                          items:
     *                              type: object
     *                              properties:
     *                                  _id:
     *                                      type: string
     *                                      description: ID user
     *                                      example: 1234567890abcdef12345678
     *                                  fullName:
     *                                      type: string
     *                                      description: Nama lengkap user
     *                                      example: John Doe
     *                                  userName:
     *                                      type: string
     *                                      description: Username user
     *                                      example: johndoe
     *                                  createdAt:
     *                                      type: string
     *                                      description: Tanggal pembuatan user
     *                                      example: 2023-01-01T00:00:00.000Z
     *                                  updatedAt:
     *                                      type: string
     *                                      description: Tanggal update user
     *                                      example: 2023-01-01T00:00:00.000Z
     *
     *
     *
     *
     */
    router.get("/", Middleware.hasAccess(RolePermission.ADMIN_READ), (req, res) => {
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