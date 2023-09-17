import { Router } from "express";
import RoleService from "../services/role-service";

const RoleHandler = Router();

RoleHandler.post("/roles", async (req, res, next) => {
    res.status(201).send(await RoleService.createRole(req.body));
    next();
});

RoleHandler.get("/roles/:id", async (req, res, next) => {
    res.status(200).send(await RoleService.findRoleById(req.params.id));
    next();
});

RoleHandler.delete("/roles/:id", async (req, res, next) => {
    res.status(204).send(await RoleService.deleteRoleById(req.params.id));
    next();
});

export default RoleHandler;
