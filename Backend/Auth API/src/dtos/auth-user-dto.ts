export default interface AuthUserDTO {
    email: string;
    password: string;
    userId: string;
    roles: Array<string>;
}
