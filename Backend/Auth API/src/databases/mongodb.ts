import { MongoClient, Db } from "mongodb";
import Logger from "../helpers/logger";

const { MONGODB_URI, MONGODB_DATABASE } = process.env;

let dbClient: Db | null = null;

class MongoDB {
    static async connect(): Promise<Db> {
        if (!MONGODB_URI) {
            Logger.fatal("MongoDB URI was not provided");

            process.exit(1);
        }

        if (!MONGODB_DATABASE) {
            Logger.fatal("MongoDB Database was not provided");

            process.exit(1);
        }

        const mongoClient = new MongoClient(MONGODB_URI);

        const connectedMongoClient = await mongoClient.connect();

        dbClient = connectedMongoClient.db(MONGODB_DATABASE);

        Logger.debug(`Connected in MongoDB database "${MONGODB_DATABASE}"`);

        return dbClient;
    }

    static async getOrCreateClient(): Promise<Db> {
        if (dbClient) {
            return dbClient;
        }

        return MongoDB.connect();
    }
}

export default MongoDB;
