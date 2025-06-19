import {config} from "dotenv";
config();

import cors from "cors";
import http from "http";
import morgan from "morgan";
import express, {Express, Router} from "express";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";
import Database from "./config/Database";
import SwaggerConfig from "./config/SwaggerConfig";
import RoleController from "./userManagement/role/RoleController";
import UserController from "./userManagement/user/UserController";
import MenuController from "./userManagement/menu/MenuController";
import AuthController from "./auth/AuthController";
import BranchController from "./bispro/branch/BranchController";
import StockController from "./bispro/stock/StockController";
import StockTransactionController from "./bispro/stockTransaction/StockTransactionController";
import * as path from "node:path";
import fs from "fs";

class SmsApplication {

    private apps(): Express {
        const app = express();

        app.disable('x-powered-by');

        app.use(cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }))

        app.use(express.json({limit: "50mb"}));
        app.use(express.urlencoded({
            limit: "50mb",
            extended: true
        }));
        app.use(morgan("dev"));
        app.use(fileUpload({
            limits: {
                fileSize: 100 * 1024 * 1024
            }
        }));

        app.use("/api/v1", this.router());

        app.use((req, res) => {
            res.status(403).json({
                path: req.path,
                error: "Forbidden",
            })
        })
        return app;
    }

    private router(): Router {
        const router = Router();

        router.use("/auth", AuthController());
        router.use("/user", UserController());
        router.use("/role", RoleController());
        router.use("/menu", MenuController());
        router.use("/branch", BranchController());
        router.use("/stock", StockController());
        router.use("/stock-transaction", StockTransactionController());
        if(process.env.ENVIRONMENT !== "development") {
            const swaggerPath = path.join(process.cwd(), "swagger.json");
            const swaggerSpec = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));
            console.log("Swagger spec loaded from:", swaggerPath);
            console.log("Swagger spec:", swaggerSpec);
            router.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        } else
            router.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(SwaggerConfig));

        return router;
    }

    public start(): void {
        const port: number = Number(process.env.EXPRESS_SERVER_PORT) || 3000;
        Database.connect(() => {
            http.createServer(this.apps())
                .listen(port, () => {
                    console.log(`Server is running on port ${port}`);
                })
        });
    }
}


export default new SmsApplication();