import { Router } from "express";
import AuthService from "../services/auth-service";

const AuthHandler = Router();

AuthHandler.post("/register", async (req, res) => {
    res.status(200).send(await AuthService.register(req.body));
});

AuthHandler.post("/login", async (req, res) => {
    res.status(200).send(await AuthService.login(req.body));
});

AuthHandler.post("/evaluate", async (req, res) => {
    res.status(200).send(await AuthService.evaluate());
});

export default AuthHandler;
