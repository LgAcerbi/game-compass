import { Router } from "express";
import RoleService from "../services/role-service";

const RoleHandler = Router();

RoleHandler.post("/roles", async (req, res) => {
    res.status(201).send(await RoleService.createResource(req.body));
});

RoleHandler.get("/roles/:id", async (req, res) => {
    res.status(200).send(await RoleService.findRoleById(req.params.id));
});

RoleHandler.delete("/roles/:id", async (req, res) => {
    res.status(204).send(await RoleService.deleteRoleById(req.params.id));
});

export default RoleHandler;
