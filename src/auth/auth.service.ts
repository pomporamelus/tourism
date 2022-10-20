import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'
import {  UserRole, UsersEntity } from '../users/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, loginUserDto, RecoverPassDto } from 'src/users/dto';
import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersEntity) 
        private readonly UserRepository: Repository<UsersEntity> ,
        private jwtService: JwtService,
       private userService: UsersService
    ) {}


     async registUser(dto : CreateUserDto) {
        const db_user = await this.userService.findByEmail(dto.email)
        console.log(db_user)
        if(db_user){
            throw new BadRequestException('User with this email already exists')
        }

        const user = await this.sendLink(dto)
       return await this.userService.createUser(user, user.role)
    }
    
     async registAdmin(dto : CreateUserDto) {
        const db_user = await this.userService.findByEmail(dto.email)
        if(db_user){
            throw new BadRequestException('admin with this email already exists')
        }

        const admin = await this.sendLink(dto)
        await this.userService.createUser(admin,UserRole.ADMIN)
    }


    private async sendLink(dto){
        dto.activationLink = await  uuid.v4()
          
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_API_KEY
            },
        });
          
          
        let info = await transporter.sendMail({
            from: process.env.SMPT_USER, // sender address
            to: dto.email, // list of receivers
            subject: "your verification link", // Subject line
            text: `Your verification link for Adventure: ${process.env.API_URL}/auth/${dto.activationLink}`, // plain text body
          })
        return dto
    }

   async activate(activationLink: string){
        const user = await this.UserRepository.findOne({ 
            where: { 
                activationLink: activationLink
            }})
        
         if(!user){
             throw new BadRequestException('Invalid link or link expired')
         }

        user.isActivated = true
        await this.UserRepository.save(user)
        return {
            message:"user was successfully activated"
        }
    }
     async login (user: loginUserDto) {
     const user2 = await this.userService.findByEmail(user.email)

        if(!user2) {
            throw new BadRequestException('user email is incorrect')
        }

        const passEqual = await bcrypt.compare(user.password, user2.password)
        if(!passEqual) {
            throw new BadRequestException('user password is incorrect')
        } else if(!user2.isActivated){
            throw new BadRequestException('user link did not activated')
        }

        return this.generateToken(user2)
    }
    private async generateToken(user: UsersEntity) {
        const payLoad = { id: user.id, email: user.email, role: user.role}
        
        return {
            token: this.jwtService.sign(payLoad)
        }
    }
     async recoverPass(dto: RecoverPassDto){
        const db_user = await this.userService.findByEmail(dto.email)
        if(!db_user){
            throw new NotFoundException('User is not found')
        }

        Object.assign(db_user, dto)
        return await this.UserRepository.save(db_user)
    }
}
