import {Router} from "express";
import RoleService from "./RoleService";
import {SendError, SendOk} from "../../helper/ResponseHelper";
import {HasPermission, RolePermission} from "./RoleModel";


const router = Router();

export default (): Router => {
    /**
     * @swagger
     * /role:
     *   get:
     *     summary: Get all roles
     *     tags:
     *       - Roles
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       _id:
     *                         type: string
     *                         example: 68228903ec49be4f847c155d
     *                       name:
     *                         type: string
     *                         example: Admin
     *                       menuId:
     *                         type: array
     *                         example: ["menu1", "menu2"]
     *                       permission:
     *                         type: array
     *                         example: [read, write]
     *
     */
    router.get("/", (req, res) => {
        if(!req.permission)
            return res.status(403).json({ error: "Permission denied" });

        if(!HasPermission(req.permission, RolePermission.READ))
            return res.status(403).json({ error: "Permission denied" });

        RoleService.getAllRole({__v: 0})
            .then((result) => SendOk(res, result))
            .catch((error) => {
                console.log(error);
                SendError(res, error)
            });
    });

    /**
     * @swagger
     * /role:
     *   post:
     *     summary: Create a new role
     *     tags:
     *       - Roles
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *        required: true
     *        content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      data:
     *                          type: object
     *                          properties:
     *                              name:
     *                                  type: string
     *                                  example: Admin
     *                              menuId:
     *                                  type: array
     *                                  example: [68228903ec49be4f847c154a, 68228903ec49be4f847c156t]
     *                              permissions:
     *                                  type: array
     *                                  example: [read, write, delete, update]
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       _id:
     *                         type: string
     *                         example: 68228903ec49be4f847c155d
     *                       name:
     *                         type: string
     *                         example: Admin
     *                       menuId:
     *                         type: array
     *                         example: ["menu1", "menu2"]
     *                       permission:
     *                         type: array
     *                         example: [read, write]
     *
     */
    router.post("/", (req, res) => {
        if(!req.permission)
            return res.status(403).json({ error: "Permission denied" });

        if(!HasPermission(req.permission, RolePermission.READ))
            return res.status(403).json({ error: "Permission denied" });

        RoleService.createRole(req.body)
            .then((result) => SendOk(res, result))
            .catch((error) => SendError(res, error));
    });

    return router;
}