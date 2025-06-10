import {Router} from "express";
import Security from "../../config/Security";
import {RolePermission} from "../../userManagement/role/RoleModel";
import {SendError, SendOk} from "../../config/ResponseMessage";
import BranchService from "./BranchService";


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
     *     parameters:
     *       - in: query
     *         name: id
     *         schema:
     *            type: string
     *         required: false
     *         description: Branch ID to filter by
     *         example: 60c72b2f9b1e8d3f4c8b4567
     *       - in: query
     *         name: name
     *         schema:
     *              type: string
     *         required: false
     *         description: Branch name to filter by
     *         example: Main Branch
     *       - in: query
     *         name: address
     *         schema:
     *              type: string
     *         required: false
     *         description: Branch address to filter by
     *         example: 123 Main St, City, Country
     *
     *
     *     responses:
     *       200:
     *         description: Branch details retrieved successfully
     *         content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      data:
     *                          type: array
     *                          items:
     *                              type: object
     *                              properties:
     *                                  total:
     *                                      type: number
     *                                      description: Total number of branches
     *                                      example: 1
     *                                  data:
     *                                      type: array
     *                                      items:
     *                                          type: object
     *                                          properties:
     *                                              _id:
     *                                                  type: string
     *                                                  description: Branch ID
     *                                                  example: 60c72b2f9b1e8d3f4c8b4567
     *                                              name:
     *                                                  type: string
     *                                                  description: Branch name
     *                                                  example: Main Branch
     *                                              address:
     *                                                  type: string
     *                                                  description: Branch address
     *                                                  example: 123 Main St, City, Country
     *                                              createdAt:
     *                                                  type: string
     *                                                  description: Creation date of the branch
     *                                                  example: 2023-01-01T00:00:00.000Z
     *                                              updatedAt:
     *                                                  type: string
     *                                                  description: Last update date of the branch
     *                                                  example: 2023-01-01T00:00:00.000Z
     *
     *
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

            BranchService.getBranch(
                req.query.byId as string,
                req.query.byName as string,
                req.query.byAddress as string
            ).then(
                (result) => SendOk(res, result)
            ).catch(
                (err) => SendError(res, err)
            );
        }
    )

    /**
     * @swagger
     * /branch/add:
     *   post:
     *     summary: Create a new branch
     *     tags: [Branch]
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      name:
     *                          type: string
     *                          description: Name of the branch
     *                          example: Main Branch
     *                      address:
     *                          type: string
     *                          description: Address of the branch
     *                          example: 123 Main St, City, Country
     *     responses:
     *       200:
     *         description: Branch added successfully
     *         content:
     *            application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      data:
     *                          type: object
     *                          properties:
     *                              _id:
     *                                  type: string
     *                                  description: Branch ID
     *                                  example: 60c72b2f9b1e8d3f4c8b4567
     *                              name:
     *                                  type: string
     *                                  description: Branch name
     *                                  example: Main Branch
     *                              address:
     *                                  type: string
     *                                  description: Branch address
     *                                  example: 123 Main St, City, Country
     *                              createdAt:
     *                                  type: string
     *                                  description: Creation date of the branch
     *                                  example: 2023-01-01T00:00:00.000Z
     *                              updatedAt:
     *                                  type: string
     *                                  description: Last update date of the branch
     *                                  example: 2023-01-01T00:00:00.000Z
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
            BranchService.createBranch(req.body)
                .then((result) => SendOk(res, result))
                .catch((error) => SendError(res, error));
        }
    )


    /**
     * @swagger
     * /branch/update:
     *   post:
     *     summary: Update an existing branch
     *     tags: [Branch]
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *         application/json:
     *            schema:
     *               type: object
     *               properties:
     *                  _id:
     *                     type: string
     *                     description: ID of the branch to update
     *                     example: 60c72b2f9b1e8d3f4c8b4567
     *                     required: true
     *                  name:
     *                     type: string
     *                     description: Name of the branch
     *                     example: Main Branch
     *                     required: false
     *                  address:
     *                     type: string
     *                     description: Address of the branch
     *                     example: 123 Main St, City, Country
     *                     required: false
     *     responses:
     *       200:
     *         description: Branch updated successfully
     *         content:
     *            application/json:
     *              schema:
     *                  type: object
     *                  properties:
     *                      data:
     *                          type: object
     *                          properties:
     *                              _id:
     *                                  type: string
     *                                  description: Branch ID
     *                                  example: 60c72b2f9b1e8d3f4c8b4567
     *                              name:
     *                                  type: string
     *                                  description: Branch name
     *                                  example: Main Branch
     *                              address:
     *                                  type: string
     *                                  description: Branch address
     *                                  example: 123 Main St, City, Country
     *                              createdAt:
     *                                  type: string
     *                                  description: Creation date of the branch
     *                                  example: 2023-01-01T00:00:00.000Z
     *                              updatedAt:
     *                                  type: string
     *                                  description: Last update date of the branch
     *                                  example: 2023-01-01T00:00:00.000Z
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
            BranchService.updateBranch(req.body)
                .then((result) => SendOk(res, result))
                .catch((error) => SendError(res, error));
        }
    )

    return router;
}