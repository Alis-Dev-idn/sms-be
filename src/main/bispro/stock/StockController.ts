import {Router} from "express";
import {SendOk} from "../../helper/ResponseHelper";
import Middleware from "../../config/Middleware";
import {RolePermission} from "../../userManagement/role/RoleModel";


export default (): Router => {
    const router = Router();

    /**
     * @swagger
     * /stock:
     *   get:
     *     summary: Get stock details
     *     tags: [Stock]
     *     security:
     *      - bearerAuth: []
     *     responses:
     *       200:
     *         description: Stock details fetched successfully
     *       403:
     *         description: Forbidden
     */
    router.get(
        "/",
        Middleware.hasAccess(
            RolePermission.USER_READ,
            RolePermission.ADMIN_READ,
            RolePermission.WORKER_READ
        ),
        (req, res) => {
            // Logic to get stock details
            SendOk(res, "Stock details fetched successfully");
        }
    );

    return router;
}