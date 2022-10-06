import { UserRole } from "../entities"

export class CreateUserDto{
    email: string
    name: string
    password?: string
    role?: UserRole
}