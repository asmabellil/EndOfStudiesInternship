import { Gender } from "../models/enums/Gender.enum";
import { Role } from "../models/enums/Role.enum";
import { User } from "../models/user.model";

export function convertStringToRole(role: string): Role {
    switch (role) {
        case 'Admin': return Role.ADMIN;
        case 'Employee': return Role.EMPLOYEE;
    }
}

export function convertStringToGender(gender: string): Gender {
    switch (gender) {
        case 'Male': return Gender.MALE;
        case 'Female': return Gender.FEMALE;
    }
}

export function getUserFullName(user: User){
    return user.firstName + ' ' + user.lastName;
}