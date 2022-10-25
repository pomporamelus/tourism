import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../interface";
import { UserRole } from "./role.enum";


@Entity()
export class UsersEntity implements IUser{
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty()
    @Column({type: 'text', nullable: false})
    email: string

    @ApiProperty()
    @Column({type: 'text', nullable: false})
    password: string
    
    @ApiProperty()
    @Column({type: 'text', nullable: false})
    fullName: string

    @ApiProperty()
    @Column({type: 'text', nullable: false})
    phoneNumber: string

    @ApiProperty()
    @Column({type: 'text', nullable: true, default: ""})
    avatar: string

    @ApiProperty()
    @Column({type: 'text', nullable: false})
    activationLink: string

    @ApiProperty()
    @Column({type: 'boolean', default: false})
    isActivated: boolean

    @ApiProperty()
    @Column({type: 'enum', enum: UserRole})
    role: UserRole
}
