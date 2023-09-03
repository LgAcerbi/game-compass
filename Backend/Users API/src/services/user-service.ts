import { HttpError } from "../helpers/http-error";
import UserDTO from "../dtos/user-dto";

const users: Array<UserDTO> = [{ id: "test", name: "some name", email: "some@mail.com" }];

class UserService {
    static async getUserById(id: string): Promise<UserDTO | null> {
        const foundUser = users.find((user) => user.id === id) || null;

        if (!foundUser) {
            throw new HttpError(404, "User not found");
        }

        return foundUser;
    }

    static async getUserByEmail(email: string): Promise<UserDTO | null> {
        const foundUser = users.find((user) => user.email === email) || null;

        if (!foundUser) {
            throw new HttpError(404, "User not found");
        }

        return foundUser;
    }

    static async createUser(user: Omit<UserDTO, "id">): Promise<UserDTO> {
        const newUser = { ...user, id: "9" };

        users.push(newUser);

        return newUser;
    }

    static async patchUserDataById(id: string, userData: Omit<UserDTO, "id" | "name">): Promise<UserDTO> {
        const foundUserIndex = users.findIndex((user) => user.id === id);

        if (foundUserIndex === -1) {
            throw new HttpError(404, "User not found");
        }

        const foundUser = users[foundUserIndex];

        const updatedUser = Object.assign(foundUser, userData);

        users[foundUserIndex] = updatedUser;

        return updatedUser;
    }

    static async deleteUserById(id: string) {
        const foundUserIndex = users.findIndex((user) => user.id === id);

        if (foundUserIndex === -1) {
            throw new HttpError(404, "User not found");
        }

        users.splice(foundUserIndex, 1);
    }
}

export default UserService;
