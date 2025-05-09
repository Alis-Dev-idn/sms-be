import {Router} from "express";

const router = Router();

export default (): Router => {
    router.get("/", (req, res) => {
        res.send("User route ok");
    })

    return router;
}