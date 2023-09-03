import crypto from "crypto";

class PasswordHelper {
    static hashPassword(password: string): string {
        const salt = crypto.randomBytes(16).toString("hex");

        const hash = crypto.scryptSync(password, salt, 64).toString("hex");

        return `${hash}:${salt}`;
    }

    static comparePassword(storedPassword: string, suppliedPassword: string): boolean {
        const [hashedPassword, salt] = storedPassword.split(":");

        const hashedPasswordBuffer = Buffer.from(hashedPassword, "hex");
        const suppliedPasswordHashBuffer = crypto.scryptSync(suppliedPassword, salt, 64);

        return crypto.timingSafeEqual(hashedPasswordBuffer, suppliedPasswordHashBuffer);
    }
}

export default PasswordHelper;
