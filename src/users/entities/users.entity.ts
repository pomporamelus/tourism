import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../interface";
import { UserRole } from "./role.enum";


@Entity()
export class UsersEntity implements IUser{
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'text', nullable: false})
    email: string

    @Column({type: 'text', nullable: false})
    password: string
    
    @Column({type: 'text', nullable: false})
    fullName: string

    @Column({type: 'text', nullable: false})
    phoneNumber: string

    @Column({type: 'text', nullable: true, default: ""})
    avatar: string

    @Column({type: 'text', nullable: false})
    activationLink: string

    @Column({type: 'boolean', default: false})
    isActivated: boolean

    @Column({type: 'enum', enum: UserRole})
    role: UserRole
}
