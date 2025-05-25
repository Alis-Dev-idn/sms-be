import {Router} from "express";
import RoleService from "./RoleService";
import {SendError, SendOk} from "../../helper/ResponseHelper";
import {RolePermission, RolePermissionList} from "./RoleModel";
import Middleware from "../../config/Middleware";
import {AnyExpression} from "mongoose";


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
     *     parameters:
     *       - in: query
     *         name: permissions
     *         schema:
     *            type: number
     *         required: false
     *         description: Include permissions in the response (1 for true, 0 or null for false)
     *         example: 1
     *       - in: query
     *         name: menuId
     *         schema:
     *              type: number
     *         required: false
     *         description: Include menuId in the response (1 for true, 0 or null for false)
     *         example: 1
     *
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
    router.get(
        "/",
        Middleware.hasAccess(
            RolePermission.ADMIN_READ
        ),
        (req, res) => {
            const permissions = req.query.permissions;
            const menuId = req.query.menuId;

            const projection: AnyExpression = {
                __v: 0,
                permissions: 0,
                menuId: 0
            }

            if(permissions && !isNaN(Number(permissions)) && Number(permissions) == 1)
                delete projection.permissions;

            if(menuId && !isNaN(Number(menuId)) && Number(menuId) == 1)
                delete projection.menuId;

            RoleService.getAllRole(projection)
                .then((result) => SendOk(res, result))
                .catch((error) => {
                    console.log(error);
                    SendError(res, error)
                });
    });

    /**
     * @swagger
     * /role/permission:
     *   get:
     *     summary: Get all role permissions
     *     tags:
     *       - Roles
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Success
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
     *                                  "user read":
     *                                      type: string
     *                                      description: Permission name
     *                                      example: "user:read"
     */
    router.get(
        "/permission",
        Middleware.hasAccess(
            RolePermission.ADMIN_READ
        ),
        (req, res) => {
            const objRolePermission: Record<string, string> = {};
            RolePermissionList.forEach((permission) => {
                objRolePermission[permission.replace(":", " ")] = permission;
            });
            SendOk(res, objRolePermission);
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
    router.post(
        "/",
        Middleware.hasAccess(
            RolePermission.ADMIN_CREATE
        ),
        (req, res) => {
        RoleService.createRole(req.body)
            .then((result) => SendOk(res, result))
            .catch((error) => SendError(res, error));
    });

    return router;
}