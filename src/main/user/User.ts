import {Router} from "express";
import UserController from "./UserController";

const router = Router();

export default (): Router => {
    router.get("/", UserController.get("read"));
    return router;
}