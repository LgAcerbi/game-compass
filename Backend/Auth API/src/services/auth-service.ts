import LoginDTO from "../dtos/login-dto";
import RegisterDTO from "../dtos/register-dto";
import HttpError from "../helpers/http-error";
import PasswordHelper from "../helpers/password";
import AuthUserModel from "../models/auth-user-model";
import UserService from "./user-service";
import { sign } from "jsonwebtoken";

const { TOKEN_SECRET, TOKEN_EXPIRES_IN = 86400 } = process.env;

// TO-DO Get minimum age restrictions in database
const minimumAgeRestrictionByCountry = new Map([
    ["BRA", 13],
    ["USA", 13],
]);

const defaultMinimumAgeRestriction = 13;

class AuthService {
    static async checkMinimumAgeRestrictionByCountry(birthday: string, countryCode: string) {
        const minimumAgeResitriction = minimumAgeRestrictionByCountry.get(countryCode) || defaultMinimumAgeRestriction;

        const ageDate: Date = new Date(Date.now() - Number(new Date(birthday)));

        const age: number = Math.abs(ageDate.getUTCFullYear() - 1970);

        return age >= minimumAgeResitriction;
    }

    static async register(registerData: RegisterDTO): Promise<{ token: string }> {
        if (registerData.password !== registerData.passwordConfirmation) {
            throw new HttpError(400, "Passwords are not the same");
        }

        const allowedAgeToRegister = AuthService.checkMinimumAgeRestrictionByCountry(
            registerData.birthday,
            registerData.countryCode
        );

        if (!allowedAgeToRegister) {
            throw new HttpError(400, "Current user age is not allowed to register");
        }

        const foundAuthUser = await AuthUserModel.findAuthUserByEmail(registerData.email);

        if (foundAuthUser) {
            throw new HttpError(400, "User already registered with provided email");
        }

        const { id } = await UserService.createUser({
            name: registerData.name,
            birthday: registerData.birthday,
        });

        const hashedPassword = PasswordHelper.hashPassword(registerData.password);

        // TO-DO Get default roles in database
        await AuthUserModel.createAuthUser({
            email: registerData.email,
            password: hashedPassword,
            userId: id,
            roles: ["user"],
        });

        const token = sign({ id }, String(TOKEN_SECRET), { expiresIn: Number(TOKEN_EXPIRES_IN) });

        return { token };
    }

    static async login(loginData: LoginDTO) {
        const foundAuthUser = await AuthUserModel.findAuthUserByEmail(loginData.email);

        if (!foundAuthUser) {
            throw new HttpError(401, "Invalid email or password");
        }

        const correctPassword = PasswordHelper.comparePassword(foundAuthUser.password, loginData.password);

        if (!correctPassword) {
            throw new HttpError(401, "Invalid email or password");
        }

        const token = sign({ id: foundAuthUser.userId }, String(TOKEN_SECRET), { expiresIn: TOKEN_EXPIRES_IN });

        return { token };
    }

    static async evaluate() {}
}

export default AuthService;
