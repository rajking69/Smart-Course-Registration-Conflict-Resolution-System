export enum UserRole {
  STUDENT = 'STUDENT',
  ADVISOR = 'ADVISOR',
  ADMIN = 'ADMIN'
}

export interface LoginCredentials {
  username: string;
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
