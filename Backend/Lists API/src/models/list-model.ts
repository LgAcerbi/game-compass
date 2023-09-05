import { ObjectId, Document } from "mongodb";
import MongoDB from "../databases/mongodb";
import ListDTO from "../dtos/list-dto";

class ListModel {
    static async getCollectionClient() {
        const client = await MongoDB.getOrCreateClient();

        return client.collection("lists");
    }

    static parseListDocument(listDocument: Document): ListDTO {
        return {
            id: listDocument._id,
            name: listDocument.name,
            userId: listDocument.userId,
            games: listDocument.games,
        };
    }

    static async createList(userData: Omit<ListDTO, "id">): Promise<{ id: string }> {
        const client = await ListModel.getCollectionClient();

        const currentDate = new Date().toISOString();

        const { insertedId } = await client.insertOne({
            ...userData,
            createdAt: currentDate,
            updatedAt: currentDate,
            deletedAt: null,
        });

        return { id: insertedId.toString() };
    }
}

export default ListModel;
