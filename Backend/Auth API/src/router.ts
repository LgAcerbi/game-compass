import "express-async-errors";
import express from "express";
import helmet from "helmet";
import errorMiddleware from "./middlewares/error-middleware";

import AuthHandler from "./handlers/auth-handler";
import ResourceHandler from "./handlers/resource-handler";
import PermissionHandler from "./handlers/permission-handler";

const Router = express();

Router.use(helmet());
Router.use(express.json());

Router.use(AuthHandler);
Router.use(ResourceHandler);
Router.use(PermissionHandler);

Router.use(errorMiddleware);

export default Router;
