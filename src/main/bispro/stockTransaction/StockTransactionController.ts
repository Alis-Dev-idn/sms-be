import {Router} from "express";
import {SendOk} from "../../helper/ResponseHelper";
import Security from "../../config/Security";
import {RolePermission} from "../../userManagement/role/RoleModel";


export default (): Router => {
    const router = Router();

    /**
     * @swagger
     * /stock-transaction:
     *   get:
     *     summary: Get stock transaction details
     *     tags: [Stock-Transaction]
     *
     *     security:
     *      - bearerAuth: []
     *
     *     responses:
     *       200:
     *         description: Stock transaction details fetched successfully
     *       403:
     *         description: Forbidden
     */
    router.get(
        "/",
        Security.hasAccess(
            RolePermission.USER_READ,
            RolePermission.ADMIN_READ,
            RolePermission.WORKER_READ
        ),
        (req, res) => {
            // Logic to get stock transaction details
            SendOk(res, "Stock transaction details fetched successfully");
        }
    )

    return router;
}