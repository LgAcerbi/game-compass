import { ObjectId, Document } from "mongodb";
import MongoDB from "../databases/mongodb";
import AuthUserDTO from "../dtos/auth-user-dto";

class AuthUserModel {
    static async getCollectionClient() {
        const client = await MongoDB.getOrCreateClient();

        return client.collection("auth_users");
    }

    static parseAuthUserDocument(authUserDocument: Document): AuthUserDTO {
        return {
            email: authUserDocument.email,
            password: authUserDocument.password,
            userId: authUserDocument.userId,
            roles: authUserDocument.roles,
        };
    }

    static async createAuthUser(authUserData: AuthUserDTO) {
        const client = await AuthUserModel.getCollectionClient();

        const currentDate = new Date().toISOString();

        await client.insertOne({
            ...authUserData,
            createdAt: currentDate,
            updatedAt: currentDate,
            deletedAt: null,
        });
    }

    static async findAuthUserByEmail(email: string): Promise<AuthUserDTO | null> {
        const client = await AuthUserModel.getCollectionClient();

        const foundAuthUser = await client.findOne({ email });

        if (foundAuthUser) {
            return AuthUserModel.parseAuthUserDocument(foundAuthUser);
        }

        return null;
    }
}

export default AuthUserModel;
