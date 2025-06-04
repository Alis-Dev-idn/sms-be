import {Router} from "express";
import Security from "../../config/Security";
import {RolePermission} from "../../userManagement/role/RoleModel";
import {SendOk} from "../../helper/ResponseHelper";


export default (): Router => {
    const router = Router();

    /**
     * @swagger
     * /branch:
     *   get:
     *     summary: Get branch details
     *     tags: [Branch]
     *     security:
     *      - bearerAuth: []
     *     responses:
     *       200:
     *         description: Branch details fetched successfully
     *       403:
     *         description: Forbidden
     */
    router.get(
        "/",
        Security.hasAccess(
            RolePermission.ADMIN_READ,
            RolePermission.WORKER_READ
        ),
        (req, res) => {
            // Logic to get branch details
            SendOk(res, "Branch details fetched successfully");
        }
    )

    return router;
}