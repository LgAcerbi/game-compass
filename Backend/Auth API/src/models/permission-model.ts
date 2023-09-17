import { Document, ObjectId } from "mongodb";
import MongoDB from "../databases/mongodb";
import PermissionDTO from "../dtos/permission-dto";

class PermissionModel {
    static async getCollectionClient() {
        const client = await MongoDB.getOrCreateClient();

        return client.collection("permissions");
    }

    static parsePermissionDocument(permissionDocument: Document): PermissionDTO {
        return {
            id: permissionDocument._id,
            name: permissionDocument.name,
            resources: permissionDocument.resources,
        };
    }

    static async createPermission(permissionData: Omit<PermissionDTO, "id">): Promise<{ id: string }> {
        const client = await PermissionModel.getCollectionClient();

        const currentDate = new Date().toISOString();

        const { insertedId } = await client.insertOne({
            ...permissionData,
            createdAt: currentDate,
            updatedAt: currentDate,
            deletedAt: null,
        });

        return { id: insertedId.toString() };
    }

    static async findPermissionById(id: string): Promise<PermissionDTO | null> {
        const client = await PermissionModel.getCollectionClient();

        const foundPermission = await client.findOne({ _id: new ObjectId(id), deletedAt: null });

        if (foundPermission) {
            return PermissionModel.parsePermissionDocument(foundPermission);
        }

        return null;
    }

    static async softDeletePermissionById(id: string) {
        const client = await PermissionModel.getCollectionClient();

        await client.updateOne({ _id: new ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
    }
}

export default PermissionModel;
