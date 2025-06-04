import {Router} from "express";
import MenuService from "./MenuService";
import {SendError, SendOk} from "../../config/ResponseMessage";
import {RolePermission} from "../role/RoleModel";
import Security from "../../config/Security";


const router = Router();

export default (): Router => {

    /**
     * @swagger
     * /menu:
     *   get:
     *     summary: Get all menus
     *     tags:
     *       - Menu
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
     *                      total:
     *                          type: number
     *                          description: Total number of menus
     *                          example: 1
     *                      data:
     *                          type: array
     *                          items:
     *                              type: object
     *                              properties:
     *                                  _id:
     *                                     type: string
     *                                     example: 1234567890abcdef12345678
     *                                     description: ID of the menu
     *                                  name:
     *                                     type: string
     *                                     example: Menu 1
     *                                     description: Name of the menu
     *                                  createdAt:
     *                                     type: string
     *                                     example: 2023-01-01T00:00:00.000Z
     *                                     description: Date of creation
     *                                  updatedAt:
     *                                     type: string
     *                                     example: 2023-01-01T00:00:00.000Z
     *                                     description: Date of update
     *
     *
     *
     */
    router.get(
        "/",
        Security.hasAccess(
            RolePermission.ADMIN_CREATE
        ),
        (req, res) => {
        MenuService.getAllMenus({__v: 0})
            .then((result) => SendOk(res, result))
            .catch(error => {
                console.log("Error: ", error);
                SendError(res, error)
            });
    });

    /**
     * @swagger
     * /menu:
     *   post:
     *     summary: Create a new menu
     *     tags:
     *       - Menu
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
     *                          example: Menu 1
     *                          description: Name of the menu
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      data:
     *                          type: object
     *                          properties:
     *                              _id:
     *                                  type: string
     *                                  example: 1234567890abcdef12345678
     *                                  description: ID of the menu
     *                              name:
     *                                  type: string
     *                                  example: Menu 1
     *                                  description: Name of the menu
     *
     */
    router.post(
        "/",
        Security.hasAccess(
            RolePermission.ADMIN_CREATE
        ),
        (req, res) => {
        MenuService.saveMenu(req.body)
            .then((result) => SendOk(res, result))
            .catch(error => SendError(res, error));
    });
    return router;
}