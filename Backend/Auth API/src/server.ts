import dotenv from "dotenv";

dotenv.config({ path: "./env/.env" });

import Logger from "./helpers/logger";
import Router from "./router";
import MongoDB from "./databases/mongodb";

const PORT = parseInt(`${process.env.PORT || 80}`);

Router.listen(PORT, async () => {
    await MongoDB.connect();

    Logger.info(`Server is running at ${PORT}.`);
});
