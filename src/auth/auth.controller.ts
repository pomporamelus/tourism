import {Post, Body, Controller } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, RecoverPassDto } from 'src/users/dto';
import { UsersEntity } from 'src/users/entities';
import { AuthService } from './auth.service';
@ApiTags('authorization')
@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {}
    @ApiOperation({summary : 'to regist user'})
    @Post('/registUser')
    async registUser(@Body() dto: CreateUserDto) {
        return await this.service.registUser(dto)
    }
    @ApiOperation({summary : 'to regist admin'})
    @Post('/registAdmin')
    async registAdmin(@Body() dto: CreateUserDto) {
        return await this.service.registAdmin(dto)
    }
    @ApiOperation({summary : 'to login your account'})
    @Post('/login')
    async regist(@Body() user: UsersEntity) {
        return await this.service.login(user)
    }
    @ApiOperation({summary : 'to recover your password'})
    @Post('/recoverPass')
    async recoverPass(@Body() dto: RecoverPassDto) {
        return await this.service.recoverPass(dto)
    }

}
