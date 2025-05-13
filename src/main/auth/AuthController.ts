import {RequestHandler} from "express";
import AuthService from "./AuthService";
import authService from "./AuthService";
import {joiUserLogin} from "../joi/UserJoi";


class AuthController {

    private authService = AuthService;

    public login(): RequestHandler {
        return (req, res) => {
            const {error} = joiUserLogin.validate(req.body);
            if (error)
                return res.status(400).json({error: error.details[0].message});
            authService.login(req.body)
                .then(user => res.status(200).json(user))
                .catch(error => {
                    if(error.errorMsg)
                        return res.status(error.status).json({error: error.errorMsg});
                    res.status(500).json({error: "Internal Server Error"});
                });
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