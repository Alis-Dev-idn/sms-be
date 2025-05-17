import {RequestHandler, Router} from "express";
import MenuService from "./MenuService";
import {SendError, SendOk} from "../../helper/ResponseHelper";


const router = Router();

export default (): Router => {
    /**
     * @swagger
     * /menu:
     *   get:
     *     summary: Get all menus
     *     tags:
     *       - Get-Menus
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Daftar semua menu
     */
    router.get("/", (req, res) => {
        // if (!req.permission || !req.permission.some((perm) => permission.includes(perm)))
        //     return res.status(403).json({error: "Permission denied"});

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
     *       - Create-Menus
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Menu created successfully
     */
    router.post("/", (req, res) => {
        MenuService.saveMenu(req.body)
            .then((result) => SendOk(res, result))
            .catch(error => SendError(res, error));
    });
    return router;
}

// class MenuController {
//
//     public get(...permission: RolePermission[]): RequestHandler {
//         return (req, res) => {
//             if (!req.permission || !req.permission.some((perm) => permission.includes(perm)))
//                 return res.status(403).json({ error: "Permission denied" });
//
//             MenuService.getAllMenus({__v: 0})
//                 .then((result) => SendOk(res, result))
//                 .catch(error => {
//                     console.log("Error: ", error);
//                     SendError(res, error)
//                 });
//         }
//     }
//
//     public create(...permission: RolePermission[]): RequestHandler {
//         return (req, res) => {
//             if (!req.permission || !req.permission.some((perm) => permission.includes(perm)))
//                 res.status(403).json({ error: "Permission denied" });
//
//             MenuService.saveMenu(req.body)
//                 .then((result) => SendOk(res, result))
//                 .catch(error => SendError(res, error));
//         }
//     }
// }
//
// export default new MenuController();