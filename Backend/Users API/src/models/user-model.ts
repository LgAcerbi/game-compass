import { ObjectId, Document } from "mongodb";
import MongoDB from "../databases/mongodb";
import UserDTO from "../dtos/user-dto";

class UserModel {
    static async getCollectionClient() {
        const client = await MongoDB.getOrCreateClient();

        return client.collection("users");
    }

    static parseUserDocument(userDocument: Document): UserDTO {
        return {
            id: userDocument._id.toString(),
            name: userDocument.name,
            birthday: userDocument.birthday,
            profilePictureUrl: userDocument.profilePictureUrl,
        };
    }

    static async findUserById(id: string): Promise<UserDTO | null> {
        const client = await UserModel.getCollectionClient();

        const foundUserDocument = await client.findOne({ _id: new ObjectId(id), deletedAt: null });

        if (foundUserDocument) {
            return UserModel.parseUserDocument(foundUserDocument);
        }

        return null;
    }

    /**
     * @deprecated
     */
    static async findUserByEmail(email: string): Promise<UserDTO | null> {
        const client = await UserModel.getCollectionClient();

        const foundUserDocument = await client.findOne({ email, deletedAt: null });

        if (foundUserDocument) {
            return UserModel.parseUserDocument(foundUserDocument);
        }

        return null;
    }

    static async createUser(userData: Omit<UserDTO, "id">): Promise<{ id: string }> {
        const client = await UserModel.getCollectionClient();

        const currentDate = new Date().toISOString();

        const { insertedId } = await client.insertOne({
            ...userData,
            createdAt: currentDate,
            updatedAt: currentDate,
            deletedAt: null,
        });

        return { id: insertedId.toString() };
    }

    static async updateUserById(id: string, userData: Omit<UserDTO, "id" | "name">) {
        const client = await UserModel.getCollectionClient();

        await client.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...userData, updatedAt: new Date().toISOString() } }
        );
    }

    static async softDeleteUserById(id: string) {
        const client = await UserModel.getCollectionClient();

        await client.updateOne({ _id: new ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
    }
}

export default UserModel;
