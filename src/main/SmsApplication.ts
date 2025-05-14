import {config} from "dotenv";
config();

import cors from "cors";
import http from "http";
import morgan from "morgan";
import express, {Express} from "express";
import fileUpload from "express-fileupload";
import Database from "./Database";
import User from "./user/User";
import Role from "./role/Role";
import Menu from "./menu/Menu";
import Auth from "./auth/Auth";
import Middleware from "./Middleware";

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

        app.use("/api/v1/user", Middleware.tokenAccess, User());
        app.use("/api/v1/auth", Auth());
        app.use("/api/v1/role", Middleware.tokenAccess, Role());
        app.use("/api/v1/menu", Middleware.tokenAccess, Menu());

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