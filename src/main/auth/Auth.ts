import {Router} from "express";

const router = Router();

export default (): Router => {
    router.get("/", (req, res) => {
        res.send("Auth route ok");
    })

    return router;
}