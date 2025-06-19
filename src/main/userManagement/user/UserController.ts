import {Router} from "express";
import UserService from "./UserService";
import {SendError, SendOk} from "../../config/ResponseMessage";
import {RolePermission} from "../role/RoleModel";
import Security from "../../config/Security";

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
    router.get(
        "/",
        Security.hasAccess(
            RolePermission.ADMIN_READ
        ),
        (req, res) => {
        UserService.getAllUser({__v: 0, roleId: 0, menuId: 0, password: 0})
            .then(result => SendOk(res, result.map(items => {
                return {
                    _id: items._id,
                    fullName: items.fullName,
                    userName: items.userName,
                    createdBy: items.createdBy? items.createdBy : {_id: null, fullName: "SYSTEM"},
                    updatedAt: items.updatedAt,
                    createdAt: items.createdAt
                };
            })))
            .catch(error => SendError(res, error))
    });

    return router;
}