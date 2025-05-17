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
     *                      type: object
     *                      properties:
     *                          total:
     *                              type: number
     *                              description: Total number of roles
     *                              example: 1
     *                          data:
     *                              type: array
     *                              items:
     *                                  type: object
     *                                  properties:
     *                                      _id:
     *                                          type: string
     *                                          description: Role ID
     *                                          example: 1234567890abcdef12345678
     *                                      name:
     *                                          type: string
     *                                          description: Role name
     *                                          example: Admin
     *                                      menuId:
     *                                          type: array
     *                                          example: [menu1, menu2]
     *                                          description: List of menu IDs
     *                                      permission:
     *                                          type: array
     *                                          example: [read, write]
     *                                          description: List of permissions
     *                                      createdAt:
     *                                          type: string
     *                                          description: Created at
     *                                          example: 2023-01-01T00:00:00.000Z
     *                                      updatedAt:
     *                                          type: string
     *                                          description: Updated at
     *                                          example: 2023-01-01T00:00:00.000Z
     *
     *
     */
    router.get("/", (req, res) => {
        if(!req.permission)
            return res.status(403).json({ error: "Permission denied" });

        if(!HasPermission(req.permission))
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
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      name:
     *                          type: string
     *                          description: Role name
     *                          example: Admin
     *                      menuId:
     *                          type: array
     *                          example: [1234567890abcdef12345678]
     *                          description: List of menu IDs
     *                      permission:
     *                          type: array
     *                          example: [read, write]
     *                          description: List of permissions
     *
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                  data:
     *                      type: object
     *                      properties:
     *                          _id:
     *                              type: string
     *                              description: Role ID
     *                              example: 1234567890abcdef12345678
     *                          name:
     *                              type: string
     *                              description: Role name
     *                              example: Admin
     *                          menuId:
     *                              type: array
     *                              example: [menu1, menu2]
     *                              description: List of menu IDs
     *                          permission:
     *                              type: array
     *                              example: [read, write]
     *                              description: List of permissions
     *                          createdAt:
     *                              type: string
     *                              description: Created at
     *                              example: 2023-01-01T00:00:00.000Z
     *                          updatedAt:
     *                              type: string
     *                              description: Updated at
     *                              example: 2023-01-01T00:00:00.000Z
     */
    router.post("/", (req, res) => {
        if(!req.permission)
            return res.status(403).json({ error: "Permission denied" });

        if(!HasPermission(req.permission))
            return res.status(403).json({ error: "Permission denied" });

        RoleService.createRole(req.body)
            .then((result) => SendOk(res, result))
            .catch((error) => SendError(res, error));
    });

    return router;
}