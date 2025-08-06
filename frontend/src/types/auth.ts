export enum UserRole {
    STUDENT = 'student',
    ADVISOR = 'advisor',
    ADMIN = 'admin'
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    firstName: string;
    lastName: string;
}
