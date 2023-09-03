import { HttpError } from "../helpers/http-error";
import UserDTO from "../dtos/user-dto";
import UserModel from "../models/user-model";

const users: Array<UserDTO> = [{ id: "test", name: "some name", email: "some@mail.com" }];

class UserService {
    static async getUserById(id: string): Promise<UserDTO | null> {
        const foundUser = await UserModel.findUserById(id);

        if (!foundUser) {
            throw new HttpError(404, "User not found");
        }

        return foundUser;
    }

    static async getUserByEmail(email: string): Promise<UserDTO | null> {
        const foundUser = await UserModel.findUserByEmail(email);

        if (!foundUser) {
            throw new HttpError(404, "User not found");
        }

        return foundUser;
    }

    static async createUser(userData: Omit<UserDTO, "id">): Promise<UserDTO> {
        const { id } = await UserModel.createUser(userData);

        return { ...userData, id };
    }

    static async patchUserDataById(id: string, userData: Omit<UserDTO, "id" | "name">): Promise<UserDTO> {
        const foundUser = await UserModel.findUserById(id);

        if (!foundUser) {
            throw new HttpError(404, "User not found");
        }

        await UserModel.updateUserById(id, userData);

        const updatedUser = Object.assign(foundUser, userData);

        return updatedUser;
    }

    static async deleteUserById(id: string) {
        const foundUser = await UserModel.findUserById(id);

        if (!foundUser) {
            throw new HttpError(404, "User not found");
        }

        await UserModel.softDeleteUserById(id);
    }
}

export default UserService;
