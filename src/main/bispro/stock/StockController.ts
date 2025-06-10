import {Router} from "express";
import {SendError, SendOk} from "../../config/ResponseMessage";
import Security from "../../config/Security";
import {RolePermission} from "../../userManagement/role/RoleModel";
import StockService from "./StockService";
import {IStock} from "./Stock";
import mongoose from "mongoose";
import {IObjectId} from "../../config/Database";


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
        Security.hasAccess(
            RolePermission.USER_READ,
            RolePermission.ADMIN_READ,
            RolePermission.WORKER_READ
        ),
        (req, res) => {
            // Logic to get stock details
            StockService.listStocks({__v: 0})
                .then(result => SendOk(res, result))
                .catch(e => SendError(res, e))
        }
    );

    /**
     * @swagger
     * /stock/add:
     *   post:
     *     summary: Create a new stock
     *     tags: [Stock]
     *     security:
     *      - bearerAuth: []
     *     responses:
     *       200:
     *         description: Stock added successfully
     *         content:
     *            application/json:
     *                schema:
     *                   type: object
     *                   properties:
     *                      data:
     *                          type: object
     *                          properties:
     *                              name:
     *                                  type: string
     *                                  description: Name of the stock
     *                                  example: "Sample Stock"
     *                              qty:
     *                                  type: number
     *                                  description: Quantity of the stock
     *                                  example: 100
     *                              expiryDate:
     *                                  type: string
     *                                  format: date-time
     *                                  description: Expiry date of the stock
     *                                  example: "2024-10-01T00:00:00.000Z"
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
            const data = req.body as IStock;
            if(!data)
                return SendError(res, {status: 400, error: "Invalid data"});
            data.createdBy = new mongoose.Types.ObjectId(req._id) as IObjectId;
            StockService.addStock(req.body)
                .then(result => SendOk(res, result))
                .catch(e => SendError(res, e));
        }
    )

    /**
     * @swagger
     * /stock/update:
     *   post:
     *     summary: Update stock details
     *     tags: [Stock]
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      id:
     *                        type: string
     *                        description: ID of the stock to update
     *                        example: "60c72b2f9b1e8b001c8e4f5a"
     *                        required: true
     *                      name:
     *                        type: string
     *                        description: New name of the stock
     *                        example: "Updated Stock Name"
     *                        required: false
     *                      qty:
     *                        type: number
     *                        description: New quantity of the stock
     *                        example: 150
     *                        required: false
     *                      expiryDate:
     *                        type: string
     *                        format: date-time
     *                        description: New expiry date of the stock
     *                        example: "2024-12-31T00:00:00.000Z"
     *                        required: false
     *     responses:
     *       200:
     *         description: Stock updated successfully
     *         content:
     *            application/json:
     *                schema:
     *                   type: object
     *                   properties:
     *                      data:
     *                          type: object
     *                          properties:
     *                              _id:
     *                                  type: string
     *                                  description: ID of the stock
     *                                  example: "60c72b2f9b1e8b001c8e4f5a"
     *                              name:
     *                                  type: string
     *                                  description: Name of the stock
     *                                  example: "Sample Stock"
     *                              qty:
     *                                  type: number
     *                                  description: Quantity of the stock
     *                                  example: 100
     *                              expiryDate:
     *                                  type: string
     *                                  format: date-time
     *                                  description: Expiry date of the stock
     *                                  example: "2024-10-01T00:00:00.000Z"
     *       403:
     *         description: Forbidden
     */
    router.post(
        "/update",
        Security.hasAccess(
            RolePermission.ADMIN_UPDATE,
            RolePermission.WORKER_UPDATE
        ),
        (req, res) => {
            const {id, name, qty, expiryDate} = req.body;
            if(!id)
                return SendError(res, {status: 400, errorMsg: "Invalid stock ID"});
            if(!name && qty === undefined && !expiryDate)
                return SendError(res, {status: 400, errorMsg: "No fields to update"});
            StockService.updateStock(
                id,
                req._id || "",
                name,
                qty,
                expiryDate
            )
                .then(result => SendOk(res, result))
                .catch(e => SendError(res, e));
        }
    )

    return router;
}