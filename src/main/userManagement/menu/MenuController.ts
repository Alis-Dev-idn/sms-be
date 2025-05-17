import {Router} from "express";
import MenuService from "./MenuService";
import {SendError, SendOk} from "../../helper/ResponseHelper";
import {HasPermission} from "../role/RoleModel";


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
     */
    router.get("/", (req, res) => {
        if (!req.permission)
            return res.status(403).json({error: "Permission denied"});

        if(!HasPermission(req.permission))
            return res.status(403).json({error: "Permission denied"});

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
     *     responses:
     *       200:
     *         description: Success
     */
    router.post("/", (req, res) => {
        if (!req.permission)
            return res.status(403).json({error: "Permission denied"});

        if(!HasPermission(req.permission))
            return res.status(403).json({error: "Permission denied"});

        MenuService.saveMenu(req.body)
            .then((result) => SendOk(res, result))
            .catch(error => SendError(res, error));
    });
    return router;
}