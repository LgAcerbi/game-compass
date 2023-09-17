import { Router } from "express";
import ResourceService from "../services/resource-service";

const ResourceHandler = Router();

ResourceHandler.post("/resources", async (req, res) => {
    res.status(201).send(await ResourceService.createResource(req.body));
});

ResourceHandler.get("/resources/:id", async (req, res) => {
    res.status(200).send(await ResourceService.findResourceById(req.params.id));
});

ResourceHandler.delete("/resources/:id", async (req, res) => {
    res.status(204).send(await ResourceService.deleteResourceById(req.params.id));
});

export default ResourceHandler;
