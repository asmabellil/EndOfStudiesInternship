import { Gender } from "./enums/Gender.enum";
import { Role } from "./enums/Role.enum";

export class User {
    id: number;
    userRef: string;
    jobTitle: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: Gender;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    referrantId?: number; // The manager referrant of the user
    enabled: boolean;
}