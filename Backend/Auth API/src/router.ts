import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import errorMiddleware from "./middlewares/error-middleware";

const Router = express();

Router.use(helmet());
Router.use(express.json());

Router.use(errorMiddleware);

export default Router;
