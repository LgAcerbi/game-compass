import { Router } from "express";
import UserService from "../services/user-service";

const UserHandler = Router();

UserHandler.get("/users/:id", async (req, res, next) => {
    res.status(200).send(await UserService.getUserById(req.params.id));
    next();
});

/**
 * @deprecated
 */
UserHandler.get("/users/email/:email", async (req, res, next) => {
    res.status(200).send(await UserService.getUserByEmail(req.params.email));
    next();
});

UserHandler.post("/users", async (req, res, next) => {
    res.status(201).send(await UserService.createUser(req.body));
    next();
});

UserHandler.patch("/users/:id/personal-data", async (req, res, next) => {
    res.status(200).send(await UserService.patchUserDataById(req.params.id, req.body));
    next();
});

UserHandler.delete("/users/:id", async (req, res, next) => {
    res.status(204).send(await UserService.deleteUserById(req.params.id));
    next();
});

export default UserHandler;
