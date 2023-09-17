import { Router } from "express";
import PermissionService from "../services/permission-service";

const PermissionHandler = Router();

PermissionHandler.post("/permissions", async (req, res) => {
    res.status(201).send(await PermissionService.createPermission(req.body));
});

PermissionHandler.get("/permissions/:id", async (req, res) => {
    res.status(200).send(await PermissionService.findPermissionById(req.params.id));
});

PermissionHandler.delete("/permissions/:id", async (req, res) => {
    res.status(204).send(await PermissionService.deletePermissionById(req.params.id));
});

export default PermissionHandler;
