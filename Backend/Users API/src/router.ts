import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import errorMiddleware from "./middlewares/error-middleware";
import UserHandler from "./handlers/user-handler";

const router = express();

router.use(helmet());
router.use(express.json());

router.use(UserHandler);

router.use(errorMiddleware);

export default router;
