import {RequestHandler, Router} from "express";
import AuthService from "./AuthService";
import authService from "./AuthService";
import {joiUserLogin} from "../config/joi/UserJoi";
import {SendError, SendOk} from "../helper/ResponseHelper";

const router = Router();

export default (): Router => {
    router.post("/",(req, res) => {
        const {error} = joiUserLogin.validate(req.body);
        if (error)
            return res.status(400).json({error: error.details[0].message});
        authService.login(req.body)
            .then(user => SendOk(res, user))
            .catch(error => SendError(res, error));
    });
    router.post("/logout", (req, res) => {
        res.send("Logout OK");
    });
    router.post("/register", (req, res) => {
        res.send("Resgister OK");
    });

    return router;
}