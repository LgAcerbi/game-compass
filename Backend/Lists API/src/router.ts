import "express-async-errors";
import express from "express";
import helmet from "helmet";
import errorMiddleware from "./middlewares/error-middleware";
import ListHandler from "./handlers/list-handler";

const Router = express();

Router.use(helmet());
Router.use(express.json());

Router.use(ListHandler);

Router.use(errorMiddleware);

export default Router;
