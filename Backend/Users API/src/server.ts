import dotenv from "dotenv";
dotenv.config({ path: "./env/.env" });

import { Logger } from "./helpers/logger";

const PORT = parseInt(`${process.env.PORT || 80}`);

import router from "./router";

router.listen(PORT, () => Logger.info(`Server is running at ${PORT}.`));
