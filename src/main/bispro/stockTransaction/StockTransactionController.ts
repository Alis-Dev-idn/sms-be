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
     *         content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      data:
     *                          type: object
     *                          properties:
     *                              total:
     *                                  type: number
     *                                  description: Total number of stock transactions
     *                                  example: 1
     *                              data:
     *                                  type: array
     *                                  items:
     *                                      data:
     *                                      type: object
     *                                      properties:
     *                                          _id:
     *                                              type: string
     *                                              description: Unique identifier for the stock transaction
     *                                              example: "60c72b2f9b1e8c001c8e4f5a"
     *                                          name:
     *                                              type: string
     *                                              description: Name of the stock transaction
     *                                              example: "Stock Transaction 1"
     *                                          qtyOut:
     *                                              type: number
     *                                              description: Quantity of stock out
     *                                              example: 10
     *                                          requestBy:
     *                                              type: string
     *                                              description: User who requested the stock transaction
     *                                              example: "ADMIN"
     *                                          branch:
     *                                              type: string
     *                                              description: Branch name associated with the stock transaction
     *                                              example: "Main Branch"
     *                                          createdBy:
     *                                              type: string
     *                                              description: User who created the stock transaction
     *                                              example: "ADMIN"
     *                                          transDate:
     *                                              type: string
     *                                              description: Date of the stock transaction
     *                                              example: "2023-10-01T00:00:00.000Z"
     *                                          createdAt:
     *                                              type: string
     *                                              description: Timestamp when the stock transaction was created
     *                                              example: "2023-10-01T00:00:00.000Z"
     *                                          updatedAt:
     *                                              type: string
     *                                              description: Timestamp when the stock transaction was last updated
     *                                              example: "2023-10-01T00:00:00.000Z"
     *                                          updatedBy:
     *                                              type: string
     *                                              description: User who last updated the stock transaction
     *                                              example: "ADMIN"
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

    /**
     * @swagger
     * /stock-transaction/add:
     *   post:
     *     summary: Add a new stock transaction
     *     tags: [Stock-Transaction]
     *
     *     security:
     *      - bearerAuth: []
     *
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               stockId:
     *                 type: string
     *                 description: ID of the stock item
     *                 example: "60c72b2f9b1e8c001c8e4f5a"
     *               branchId:
     *                 type: string
     *                 description: ID of the branch
     *                 example: "60c72b2f9b1e8c001c8e4f5b"
     *               qtyOut:
     *                 type: number
     *                 description: Quantity of stock out
     *                 example: 10
     *
     *     responses:
     *       200:
     *         description: Stock transaction added successfully
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
     *                                  description: Unique identifier for the stock transaction
     *                                  example: "60c72b2f9b1e8c001c8e4f5a"
     *                              name:
     *                                  type: string
     *                                  description: Name of the stock transaction
     *                                  example: "Stock Transaction 1"
     *                              qtyOut:
     *                                  type: number
     *                                  description: Quantity of stock out
     *                                  example: 10
     *                              requestBy:
     *                                  type: string
     *                                  description: User who requested the stock transaction
     *                                  example: "ADMIN"
     *                              branch:
     *                                  type: string
     *                                  description: Branch name associated with the stock transaction
     *                                  example: "Main Branch"
     *
     *
     *       403:
     *         description: Forbidden
     */
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