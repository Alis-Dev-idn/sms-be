import {Router} from "express";
import {SendError, SendOk} from "../../config/ResponseMessage";
import Security from "../../config/Security";
import {RolePermission} from "../../userManagement/role/RoleModel";
import StockTransactionService from "./StockTransactionService";


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
            StockTransactionService
                .listStockTransactions()
                .then((result) => SendOk(res, result))
                .catch((err) => SendError(res, err));
        }
    )

    router.post(
        "/add",
        Security.hasAccess(
            RolePermission.ADMIN_CREATE,
            RolePermission.WORKER_CREATE
        ),
        (req, res) => {
            // Logic to add a new stock transaction
            StockTransactionService
                .addStockTransaction(req._id || "", req.body)
                .then((result) => SendOk(res, result))
                .catch((err) => SendError(res, err));
        }
    )

    return router;
}