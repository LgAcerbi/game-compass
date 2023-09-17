import { JwtPayload } from "jsonwebtoken";

export default interface JwtPayloadDTO extends JwtPayload {
    id: string;
    email: string;
}
