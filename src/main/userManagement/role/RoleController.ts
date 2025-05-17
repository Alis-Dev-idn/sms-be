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