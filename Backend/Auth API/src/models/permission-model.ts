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
            id: permissionDocument._id.toString(),
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

    static async findAllPermissions(): Promise<Array<PermissionDTO> | []> {
        const client = await PermissionModel.getCollectionClient();

        const foundPermissionsCursor = client.find({ deletedAt: null });

        const foundPermissions = [];

        for await (const foundRole of foundPermissionsCursor) {
            foundPermissions.push(PermissionModel.parsePermissionDocument(foundRole));
        }

        return foundPermissions;
    }

    static async findPermissionById(id: string): Promise<PermissionDTO | null> {
        const client = await PermissionModel.getCollectionClient();

        const foundPermission = await client.findOne({ _id: new ObjectId(id), deletedAt: null });

        if (foundPermission) {
            return PermissionModel.parsePermissionDocument(foundPermission);
        }

        return null;
    }

    static async findPermissionsByIds(ids: Array<string>): Promise<Array<PermissionDTO> | []> {
        const client = await PermissionModel.getCollectionClient();

        const parsedIds = ids.map((id) => new ObjectId(id));

        const foundPermissionsCursor = client.find({ _id: { $in: parsedIds }, deletedAt: null });

        const foundPermissions = [];

        for await (const foundRole of foundPermissionsCursor) {
            foundPermissions.push(PermissionModel.parsePermissionDocument(foundRole));
        }

        return foundPermissions;
    }

    static async softDeletePermissionById(id: string) {
        const client = await PermissionModel.getCollectionClient();

        await client.updateOne({ _id: new ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
    }
}

export default PermissionModel;
