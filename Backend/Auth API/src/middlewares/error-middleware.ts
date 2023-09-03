import { Request, Response, NextFunction } from "express";

import HttpError from "../helpers/http-error";

const errorMiddleware = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode || 500).send(error.message);
};

export default errorMiddleware;
