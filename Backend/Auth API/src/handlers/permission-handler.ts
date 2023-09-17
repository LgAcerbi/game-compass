import { Router } from "express";
import PermissionService from "../services/permission-service";

const PermissionHandler = Router();

PermissionHandler.post("/permissions", async (req, res, next) => {
    res.status(201).send(await PermissionService.createPermission(req.body));
    next();
});

PermissionHandler.get("/permissions/:id", async (req, res, next) => {
    res.status(200).send(await PermissionService.findPermissionById(req.params.id));
    next();
});

PermissionHandler.delete("/permissions/:id", async (req, res, next) => {
    res.status(204).send(await PermissionService.deletePermissionById(req.params.id));
    next();
});

export default PermissionHandler;
