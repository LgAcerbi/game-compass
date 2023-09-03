import { Router } from "express";
import UserService from "../services/user-service";

const UserHandler = Router();

UserHandler.get("/users/:id", async (req, res) => {
    res.status(200).send(await UserService.getUserById(req.params.id));
});

UserHandler.get("/users/email/:email", async (req, res) => {
    res.status(200).send(await UserService.getUserByEmail(req.params.email));
});

UserHandler.post("/users", async (req, res) => {
    res.status(201).send(await UserService.createUser(req.body));
});

UserHandler.patch("/users/:id/personal-data", async (req, res) => {
    res.status(200).send(await UserService.patchUserDataById(req.params.id, req.body));
});

UserHandler.delete("/users/:id", async (req, res) => {
    res.status(204).send(await UserService.deleteUserById(req.params.id));
});

export default UserHandler;
