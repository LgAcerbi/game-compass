import "express-async-errors";
import express from "express";
import helmet from "helmet";
import errorMiddleware from "./middlewares/error-middleware";
import loggerMiddleware from "./middlewares/logger-middleware";

import UserHandler from "./handlers/user-handler";

const Router = express();

Router.use(helmet());
Router.use(express.json());

Router.use(UserHandler);

Router.use(errorMiddleware);
Router.use(loggerMiddleware);

export default Router;
