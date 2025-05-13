import {Router} from "express";
import AuthController from "./AuthController";

const router = Router();

export default (): Router => {
    router.post("/", AuthController.login());
    router.post("/logout", AuthController.logout());
    router.post("/register", AuthController.register());

    return router;
}