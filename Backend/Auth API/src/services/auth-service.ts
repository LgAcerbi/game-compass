import { sign, verify } from "jsonwebtoken";
import RoleService from "./role-service";
import PermissionService from "./permission-service";
import ResourceService from "./resource-service";
import UserService from "./user-service";
import AuthUserModel from "../models/auth-user-model";
import EvaluateDTO from "../dtos/evaluate-dto";
import LoginDTO from "../dtos/login-dto";
import RegisterDTO from "../dtos/register-dto";
import JwtPayloadDTO from "../dtos/jwt-payload-dto";
import PasswordHelper from "../helpers/password";
import HttpError from "../helpers/http-error";

const { JWT_TOKEN_SECRET, JWT_TOKEN_EXPIRES_IN = 86400 } = process.env;

// TO-DO !important Implement sessions for each token with REDIS

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

        const token = sign({ id }, String(JWT_TOKEN_SECRET), { expiresIn: Number(JWT_TOKEN_EXPIRES_IN) });

        return { token };
    }

    static async login(loginData: LoginDTO): Promise<{ token: string }> {
        const foundAuthUser = await AuthUserModel.findAuthUserByEmail(loginData.email);

        if (!foundAuthUser) {
            throw new HttpError(401, "Invalid email or password");
        }

        const correctPassword = PasswordHelper.comparePassword(foundAuthUser.password, loginData.password);

        if (!correctPassword) {
            throw new HttpError(401, "Invalid email or password");
        }

        const token = sign({ id: foundAuthUser.userId, email: foundAuthUser.email }, String(JWT_TOKEN_SECRET), {
            expiresIn: Number(JWT_TOKEN_EXPIRES_IN),
        });

        return { token };
    }

    static async evaluate(evaluateData: EvaluateDTO): Promise<{ evaluated: boolean }> {
        const decodedToken = verify(evaluateData.token, String(JWT_TOKEN_SECRET), { complete: true });

        const { email } = decodedToken.payload as JwtPayloadDTO;

        const foundUserPromise = AuthUserModel.findAuthUserByEmail(email);
        const foundResourcePromise = ResourceService.findResourceByEndpointData({
            method: evaluateData.method,
            endpoint: evaluateData.endpoint,
            application: evaluateData.application,
        });

        const [foundUser, foundResource] = await Promise.all([foundUserPromise, foundResourcePromise]);

        if (!foundUser) {
            // TO-DO Expire the session

            throw new HttpError(401, "Session expired");
        }

        const foundRoles = await RoleService.findRolesByIds(foundUser.roles);
        const foundPermissions = await PermissionService.findPermissionsByIds(foundRoles.map((role) => role.id));

        const resourcesWithPermission = foundPermissions.flatMap((permission) => permission.resources);

        const hasPermissionOnResource = resourcesWithPermission.find((resourceId) => resourceId === foundResource.id);

        if (!hasPermissionOnResource) {
            throw new HttpError(403, "Not enough privileges to access this resource");
        }

        return { evaluated: true };
    }
}

export default AuthService;
