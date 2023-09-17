import { Request, Response, NextFunction } from "express";
import Logger from "../helpers/logger";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    Logger.debug(`[${req.method}] ${req.path} - status: ${res.statusCode}`);

    next();
};

export default loggerMiddleware;
