import {Router} from "express";
import authService from "./AuthService";
import {joiUserLogin} from "../config/joi/UserJoi";
import {SendError, SendOk} from "../config/ResponseMessage";
import Security from "../config/Security";
import {HasPermission, RolePermission} from "../userManagement/role/RoleModel";
import UserService from "../userManagement/user/UserService";

const router = Router();

export default (): Router => {
    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userName:
     *                 type: string
     *               password:
     *                 type: string
     *             required:
     *               - username
     *               - password
     *
     *     responses:
     *       200:
     *          description: Success
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          data:
     *                              type: object
     *                              properties:
     *                                  token:
     *                                      type: string
     *                                      example: 1234567890abcdef12345678
     *                                      description: Token for authentication
     */
    router.post("/login",(req, res) => {
        const {error} = joiUserLogin.validate(req.body);
        if (error)
            return res.status(400).json({error: error.details[0].message});
        authService.login(req.body)
            .then(user => SendOk(res, user))
            .catch(error => SendError(res, error));
    });

    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Register
     *     tags:
     *       - Auth
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userName:
     *                 type: string
     *               fullName:
     *                  type: string
     *               password:
     *                 type: string
     *               roleId:
     *                  type: string
     *             required:
     *               - username
     *               - password
     *               - fullName
     *               - roleId
     *
     *     responses:
     *      200:
     *         description: Success
     *         content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      message:
     *                          type: string
     *                          description: Success message
     *                          example: "Successfully created new user"
     *
     *
     */
    router.post("/register", Security.hasAccess(RolePermission.USER_CREATE), (req, res) => {
        if(!req.permission)
            return res.status(403).json({error: "Forbidden"});
        if(!HasPermission(req.permission))
            return res.status(403).json({error: "Forbidden"});

        req.body.createdBy = req._id;
        UserService.createUser(req.body)
            .then(user => SendOk(res, "Successfully created new user"))
            .catch(error => SendError(res, error));
    });


    /**
     * @swagger
     * /auth/logout:
     *   get:
     *     summary: Logout
     *     tags:
     *       - Auth
     *     security:
     *      - bearerAuth: []
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      message:
     *                          type: string
     *                          description: Success message
     *                          example: "Logout OK"
     *
     */
    router.get("/logout", Security.revokeToken());

    /**
     * @swagger
     * /auth/refresh-token:
     *   get:
     *     summary: Refresh Token
     *     tags:
     *       - Auth
     *     security:
     *      - bearerAuth: []
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      data:
     *                         type: object
     *                         properties:
     *                             token:
     *                                type: string
     *                                example: 1234567890abcdef12345678
     *                                description: Token for authentication
     */
    router.get("/refresh-token", Security.refreshToken())

    return router;
}