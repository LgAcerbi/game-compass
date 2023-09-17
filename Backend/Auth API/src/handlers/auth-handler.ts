import { Router } from "express";
import AuthService from "../services/auth-service";

const AuthHandler = Router();

AuthHandler.post("/register", async (req, res, next) => {
    res.status(200).send(await AuthService.register(req.body));
    next();
});

AuthHandler.post("/login", async (req, res, next) => {
    res.status(200).send(await AuthService.login(req.body));
    next();
});

AuthHandler.post("/evaluate", async (req, res, next) => {
    res.status(200).send(await AuthService.evaluate(req.body));
    next();
});

export default AuthHandler;
