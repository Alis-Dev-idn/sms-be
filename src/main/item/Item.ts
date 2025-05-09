import {Router} from "express";

const router = Router();

export default (): Router => {

    router.get("/", (req, res) => {
        res.send("Item route ok");
    });

    return router;
}