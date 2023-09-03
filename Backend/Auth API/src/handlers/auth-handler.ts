import { Router } from "express";

const AuthHandler = Router();

AuthHandler.post("/register", async (req, res) => {
    res.status(200).send("Registered in");
});

AuthHandler.post("/login", async (req, res) => {
    res.status(200).send("Logged in");
});

AuthHandler.post("/evaluate", async (req, res) => {
    res.status(200).send("Registered in");
});

export default AuthHandler;
