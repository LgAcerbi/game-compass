import { Router } from "express";
import ListService from "../services/list-service";

const ListHandler = Router();

ListHandler.post("/list", async (req, res) => {
    res.status(200).send(await ListService.createList(req.body));
});

export default ListHandler;
