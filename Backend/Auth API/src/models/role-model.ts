import { Document, ObjectId } from "mongodb";
import MongoDB from "../databases/mongodb";
import RoleDTO from "../dtos/role-dto";

class RoleModel {
    static async getCollectionClient() {
        const client = await MongoDB.getOrCreateClient();

        return client.collection("roles");
    }

    static parseRoleDocument(roleDocument: Document): RoleDTO {
        return {
            id: roleDocument._id.toString(),
            name: roleDocument.name,
            permissions: roleDocument.permissions,
            default: roleDocument.default,
        };
    }

    static async createRole(roleData: Omit<RoleDTO, "id">): Promise<{ id: string }> {
        const client = await RoleModel.getCollectionClient();

        const currentDate = new Date().toISOString();

        const { insertedId } = await client.insertOne({
            ...roleData,
            createdAt: currentDate,
            updatedAt: currentDate,
            deletedAt: null,
        });

        return { id: insertedId.toString() };
    }

    static async findAllRoles(): Promise<Array<RoleDTO> | []> {
        const client = await RoleModel.getCollectionClient();

        const foundRolesCursor = client.find({ deletedAt: null });

        const foundRoles = [];

        for await (const foundRole of foundRolesCursor) {
            foundRoles.push(RoleModel.parseRoleDocument(foundRole));
        }

        return foundRoles;
    }

    static async findRoleById(id: string): Promise<RoleDTO | null> {
        const client = await RoleModel.getCollectionClient();

        const foundRole = await client.findOne({ _id: new ObjectId(id), deletedAt: null });

        if (foundRole) {
            return RoleModel.parseRoleDocument(foundRole);
        }

        return null;
    }

    static async findRolesByIds(ids: Array<string>): Promise<Array<RoleDTO> | []> {
        const client = await RoleModel.getCollectionClient();

        const parsedIds = ids.map((id) => new ObjectId(id));

        const foundRolesCursor = client.find({ _id: { $in: parsedIds }, deletedAt: null });

        const foundRoles = [];

        for await (const foundRole of foundRolesCursor) {
            foundRoles.push(RoleModel.parseRoleDocument(foundRole));
        }

        return foundRoles;
    }

    static async findDefaultRoles(): Promise<Array<RoleDTO> | []> {
        const client = await RoleModel.getCollectionClient();

        const foundRolesCursor = client.find({ default: true, deletedAt: null });

        const foundRoles = [];

        for await (const foundRole of foundRolesCursor) {
            foundRoles.push(RoleModel.parseRoleDocument(foundRole));
        }

        return foundRoles;
    }

    static async softDeleteRoleById(id: string) {
        const client = await RoleModel.getCollectionClient();

        await client.updateOne({ _id: new ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
    }
}

export default RoleModel;
