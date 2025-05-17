import {RequestHandler, Router} from "express";
import AuthService from "./AuthService";
import authService from "./AuthService";
import {joiUserLogin} from "../config/joi/UserJoi";
import {SendError, SendOk} from "../helper/ResponseHelper";

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
     *         description: Success
     *         content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      data:
     *                          type: object
     *                          properties:
     *                              token:
     *                                  type: string
     *                                  example: 1234567890abcdef12345678
     *                                  description: Token for authentication
     *                              refreshToken:
     *                                  type: string
     *                                  example: 1234567890abcdef12345678
     *                                  description: Refresh token for authentication
     *
     */
    router.post("/login",(req, res) => {
        const {error} = joiUserLogin.validate(req.body);
        if (error)
            return res.status(400).json({error: error.details[0].message});
        authService.login(req.body)
            .then(user => SendOk(res, user))
            .catch(error => SendError(res, error));
    });
    router.post("/logout", (req, res) => {
        res.send("Logout OK");
    });
    router.post("/register", (req, res) => {
        res.send("Resgister OK");
    });

    return router;
}