import {config} from "dotenv";
config();

import cors from "cors";
import http from "http";
import morgan from "morgan";
import express, {Express} from "express";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";
import Database from "./config/Database";
import Middleware from "./config/Middleware";
import SwaggerConfig from "./config/SwaggerConfig";
import RoleController from "./userManagement/role/RoleController";
import UserController from "./userManagement/user/UserController";
import MenuController from "./userManagement/menu/MenuController";
import AuthController from "./auth/AuthController";

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

        app.use("/api/v1/auth", AuthController());
        app.use("/api/v1/user", Middleware.access, UserController());
        app.use("/api/v1/role", Middleware.access, RoleController());
        app.use("/api/v1/menu", Middleware.access, MenuController());

        app.use('/api/v1/docs', (req, res, next) => {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            next();
        });
        app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(SwaggerConfig));

        app.use((req, res) => {
            res.status(404).json({
                path: req.path,
                error: "Not Found"
            })
        })

        return app;
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