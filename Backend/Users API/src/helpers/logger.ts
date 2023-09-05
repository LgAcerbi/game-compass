import { getLogger, configure } from "log4js";

const { LOGGER_LEVEL = "INFO" } = process.env;

configure({
    appenders: {
        console: { type: "stdout", layout: { type: "colored" } },
    },
    categories: {
        default: { appenders: ["console"], level: LOGGER_LEVEL },
    },
});

const Logger = getLogger();

export default Logger;
