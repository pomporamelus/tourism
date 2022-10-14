import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'
import {  UserRole, UsersEntity } from '../users/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, RecoverPassDto } from 'src/users/dto';
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
        await this.userService.createUser(user, UserRole.USER)
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
        dto.activationLink = uuid.v4()
          
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: 'gmail',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD
            }
        });
          
          var mailOptions = {
            from: process.env.SMTP_USER,
            to: dto.email,
            subject: 'Verification link for Adventure',
            text: `Your verification link for Adventure: ${process.env.API_URL}/${dto.activationLink}`
        };
          
        transporter.sendMail(mailOptions, function(error){
            if (error) {
                throw new BadRequestException('Invalid mail, please try again');
            }
        });

        return dto
    }

    private async activate(activationLink: string){
        const user = await this.UserRepository.findOne({ 
            where: { 
                activationLink: activationLink
            }})
        
         if(!user){
             throw new BadRequestException('Invalid link or link expired')
         }

        user.isActivated = true
        await this.UserRepository.save(user)
        return true
    }
     async login (user: UsersEntity) {
     const user2 = await this.userService.findByEmail(user.email)
     if(!user2) {
        throw new BadRequestException('user email is incorrect')
     }
    const passEqual = await bcrypt.compare(user.password, user2.password)
    if(!passEqual) {
        throw new BadRequestException('user password is incorrect')
    }
    if(!user2.isActivated){
        throw new BadRequestException('user link did not activated')
    }
    return this.generateToken(user)
    }
    private async generateToken(user: UsersEntity) {
     const payLoad = {phoneNumber: user.phoneNumber, id: user.id, email: user.email}
     return {
        token: this.jwtService.sign(payLoad)
     }
     
    }
     async recoverPass(dto: RecoverPassDto){
        const db_user = await this.userService.findByEmail(dto.email)
        if(!db_user){
            throw new NotFoundException('User is not found')
        }

        const user = await this.sendLink(dto)
        Object.assign(db_user, user)
        return await this.UserRepository.save(db_user)
    }
}
