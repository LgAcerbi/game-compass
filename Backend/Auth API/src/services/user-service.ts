import axios from "axios";
import UserDTO from "../dtos/user-dto";
import Logger from "../helpers/logger";
import HttpError from "../helpers/http-error";

const { USERS_API_URL } = process.env;

class UserService {
    static async createUser(user: Omit<UserDTO, "id">): Promise<Pick<UserDTO, "id">> {
        try {
            const response = await axios.post(`${USERS_API_URL}/users`, user);

            return response.data;
        } catch (error: any) {
            Logger.error(
                `Create user request failed - [message: ${error.response.message} | status: ${error.response.status}]`
            );

            throw new HttpError(500, "Internal Server Error");
        }
    }
}

export default UserService;
