import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../interface";
import { UserRole } from "./role.enum";


@Entity()
export class UsersEntity implements IUser{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    password: string
    
    @Column()
    fullName: string

    @Column()
    phoneNumber: string

    @Column()
    avatar: string

    @Column()
    activationLink: string

    @Column({type: 'boolean', default: false})
    isActivated: boolean

    @Column()
    role: UserRole
}
