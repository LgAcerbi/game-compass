import dotenv from "dotenv";
dotenv.config({ path: "./env/.env" });

import { Logger } from "./helpers/logger";

const PORT = parseInt(`${process.env.PORT || 80}`);

import Router from "./router";
import MongoDB from "./databases/mongodb";

Router.listen(PORT, async () => {
    await MongoDB.connect();

    Logger.info(`Server is running at ${PORT}.`);
});
