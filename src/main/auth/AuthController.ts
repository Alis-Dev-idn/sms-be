import {RequestHandler} from "express";
import AuthService from "./AuthService";
import authService from "./AuthService";
import {joiUserLogin} from "../joi/UserJoi";
import {SendError, SendOk} from "../helper/ResponseHelper";


class AuthController {

    private authService = AuthService;

    public login(): RequestHandler {
        return (req, res) => {
            const {error} = joiUserLogin.validate(req.body);
            if (error)
                return res.status(400).json({error: error.details[0].message});
            authService.login(req.body)
                .then(user => SendOk(res, user))
                .catch(error => SendError(res, error));
        }
    }

    public logout(): RequestHandler {
        return (req, res) => {
            res.send("Logout OK");
        }
    }

    public register(): RequestHandler {
        return (req, res) => {
            res.send("Register OK");
        }
    }
}

export default new AuthController();