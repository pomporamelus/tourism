import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users.service';
import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'
import { UsersEntity } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersEntity) 
        private readonly UserRepository: Repository<UsersEntity> ,
        private jwtService: JwtService,
       private userService: UsersService
    ) {}
     async sendLink(dto){
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
        return true
        //{ message: 'Email sucessfully activated' }
    }
    async login (user: UsersEntity) {
     const userActive = await this.activate(user.activationLink)
     if(!userActive){
            throw new BadRequestException('user link did not activated')
     }
     const user2 = await this.userService.findByEmail(user.email)
     if(!user2) {
        throw new BadRequestException('user email is incorrect')
     }
    const passEqual = await bcrypt.compare(user.password, user2.password)
    if(!passEqual) {
        throw new BadRequestException('user password is incorrect')
    }
    return this.generateToken(user)
    }
    private async generateToken(user: UsersEntity) {
     const payLoad = {phoneNumber: user.phoneNumber, id: user.id, email: user.email}
     return {
        token: this.jwtService.sign(payLoad)
     }
    }
}
