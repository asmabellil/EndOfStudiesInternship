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

export function isSameDay(date1: Date, date2: Date): boolean {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

export function parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); 
}