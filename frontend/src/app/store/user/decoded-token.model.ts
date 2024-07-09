import { JwtPayload } from "jwt-decode";

export interface DecodedToken extends JwtPayload {
    role: string;
    userId: number;
}