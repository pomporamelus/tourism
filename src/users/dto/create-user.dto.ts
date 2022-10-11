import { UserRole } from "../entities"

export class CreateUserDto{
    email: string
    fullName: string
    phoneNumber: string
    password: string
    role?: UserRole
}