import { Document, ObjectId } from "mongodb";
import MongoDB from "../databases/mongodb";
import ResourceDTO from "../dtos/resource-dto";

class ResourceModel {
    static async getCollectionClient() {
        const client = await MongoDB.getOrCreateClient();

        return client.collection("resources");
    }

    static parseResourceDocument(resourceDocument: Document): ResourceDTO {
        return {
            id: resourceDocument.id,
            name: resourceDocument.name,
            method: resourceDocument.method,
            endpoint: resourceDocument.endpoint,
            application: resourceDocument.application,
        };
    }

    static async createResource(resource: Omit<ResourceDTO, "id">): Promise<{ id: string }> {
        const client = await ResourceModel.getCollectionClient();

        const currentDate = new Date().toISOString();

        const { insertedId } = await client.insertOne({
            ...resource,
            createdAt: currentDate,
            updatedAt: currentDate,
            deletedAt: null,
        });

        return { id: insertedId.toString() };
    }

    static async findResourceByEndpointData(
        endpointData: Pick<ResourceDTO, "method" | "endpoint" | "application">
    ): Promise<ResourceDTO | null> {
        const client = await ResourceModel.getCollectionClient();

        const foundResource = await client.findOne({ ...endpointData, deletedAt: null });

        if (foundResource) {
            return ResourceModel.parseResourceDocument(foundResource);
        }

        return null;
    }

    static async findResourceById(id: string): Promise<ResourceDTO | null> {
        const client = await ResourceModel.getCollectionClient();

        const foundResource = await client.findOne({ _id: new ObjectId(id), deletedAt: null });

        if (foundResource) {
            return ResourceModel.parseResourceDocument(foundResource);
        }

        return null;
    }

    static async softDeleteResourceById(id: string) {
        const client = await ResourceModel.getCollectionClient();

        await client.updateOne({ _id: new ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
    }
}

export default ResourceModel;
