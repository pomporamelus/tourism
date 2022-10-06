import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, RecoverPassDto, UpdateUserDto } from './dto';
import { UserRole, UsersEntity } from './entities';
import * as randomstring from 'randomstring';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity) 
        private readonly UserRepository: Repository<UsersEntity>){}

    async findAll(){
        return await this.UserRepository.find()
    }

    async findByEmail(email: string){
        const db = await this.UserRepository.find()
        const user = db.find((i) => i.email.includes(email))
        return user
    }

    async findById(id: number){
        const user = await this.UserRepository.findOne({ 
            where: { 
                id: id
            }})

        if(!user){
            throw new NotFoundException('Менеджер не найден')
        }

        return user
    }

    private async sendPass(dto){
        dto.password = randomstring.generate(7)
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'youremail@gmail.com',
              pass: 'yourpassword'
            }
        });
          
          var mailOptions = {
            from: 'youremail@gmail.com',
            to: dto.email,
            subject: 'Kyrgyzstan tourism project',
            text: 'Your password from tourism: '+dto.password
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                throw new BadRequestException('Invalid mail, please try again');
            }
        });

        const hashPass = await bcrypt.hash(dto.password, 5)
        dto.password = hashPass
        return dto
    }

    async createUser(dto: CreateUserDto){
        const db_user = await this.findByEmail(dto.email)
        if(db_user){
            throw new BadRequestException('User with this email already exists')
        }

        const user = await this.sendPass(dto)
        user.roles = UserRole.USER

        await this.UserRepository.save(user)
        return user
    }
    
    async updateUser(dto: UpdateUserDto){
        const user = await this.findById(dto.id)
        if(!user){
            throw new NotFoundException('User is not found')
        } else if(dto.password){
            const hashPass = await bcrypt.hash(dto.password, 5)
            dto.password = hashPass
        }

        Object.assign(user, dto)
        return await this.UserRepository.save(user)
    }

    async createAdmin(dto: CreateUserDto){
        const db_user = await this.findByEmail(dto.email)
        if(db_user){
            throw new BadRequestException('User with this email already exists')
        }

        const user = await this.sendPass(dto)
        user.roles = UserRole.ADMIN

        await this.UserRepository.save(user)
        return user
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

    async recoverPass(dto: RecoverPassDto){
        const db_user = await this.findByEmail(dto.email)
        if(!db_user){
            throw new NotFoundException('User is not found')
        }

        const user = await this.sendPass(dto)
        Object.assign(db_user, user)
        return await this.UserRepository.save(db_user)
    }
}
