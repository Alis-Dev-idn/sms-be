import {Router} from "express";
import RoleController from "./RoleController";

const router = Router();

export default (): Router => {
    router.get("/", RoleController.get("read"));
    router.post("/", RoleController.create("write"));

    return router;
}