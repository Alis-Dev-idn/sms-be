import {Router} from "express";
import MenuController from "./MenuController";


const router = Router();

export default (): Router => {
    router.get("/", MenuController.get("read"));
    router.post("/", MenuController.create("read", "write"));
    return router;
}