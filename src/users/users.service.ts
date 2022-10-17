import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto,  UpdateUserDto } from './dto';
import { UserRole, UsersEntity } from './entities';
import * as bcrypt from 'bcrypt'
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity) 
        private UserRepository: Repository<UsersEntity>,
        ){}

    async findAll(){
        return await this.UserRepository.find()
    }

    async findByEmail(email: string){
        // const db = await this.UserRepository.find()
        // const user = db.find((i) => i.email.includes(email))
        const user = await this.UserRepository.findOne({ 
            where: { 
                email: email
            }})
        return user
    }

    async findById(id: number){
        const user = await this.UserRepository.findOne({ 
            where: { 
                id: id
            }})

        if(!user){
            throw new NotFoundException('User is not found')
        }

        return user
    }


    async createUser(dto: CreateUserDto, role: UserRole){
        const hashPass = await bcrypt.hash(dto.password, 5)
        dto.password = hashPass
        dto.role = role
        await this.UserRepository.save(dto)
        return {
            message: 'check your gmail'
        }
    }
    
    async updateUser(dto: UpdateUserDto){
        const user = await this.findById(dto.id)
        if(dto.password){
            const hashPass = await bcrypt.hash(dto.password, 5)
            dto.password = hashPass
        }

        Object.assign(user, dto)
        return await this.UserRepository.save(user)
    }


    async findAdmins(){
        const admins = await this.UserRepository.find({
            where: { 
                role: UserRole.ADMIN
            }})

        return admins
    }

    async deleteUser(id: number){
        const user = await this.findById(id)

        await this.UserRepository.remove(user)
        return { message: 'User is sucessfully deleted' }
    }

    async deleteAdmin(id: number){
        const user = await this.findById(id)
        if(user.role !== UserRole.ADMIN){
            throw new BadRequestException('This user is not admin')
        }

        await this.UserRepository.remove(user)
        return { message: 'Admin is sucessfully deleted' }
    }

    
}