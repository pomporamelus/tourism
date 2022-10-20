import {Post, Body, Controller, Param, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, loginUserDto, RecoverPassDto } from 'src/users/dto';
import { UserRole,  } from 'src/users/entities';
import { Role } from 'src/users/entities/role-decorator';
import { AuthService } from './auth.service';
import { RoleGuard } from './guard/role-guard';

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
    @Role( UserRole.SUPERADMIN)
    @UseGuards(RoleGuard)
    @Post('/registAdmin')
    async registAdmin(@Body() dto: CreateUserDto) {
        return await this.service.registAdmin(dto)
    }

    @ApiOperation({summary : 'to login your account'})
    @Post('/login')
    async regist(@Body() user:loginUserDto) {
        return await this.service.login(user)
    }

    @ApiOperation({})
    @Get(':activationLink')
    async activate(@Param('activationLink') activationLink: string){
        return await this.service.activate(activationLink)
    }

    @ApiOperation({summary : 'to recover your password'})
    @Role(UserRole.ADMIN, UserRole.SUPERADMIN,UserRole.USER)
    @UseGuards(RoleGuard)
    @Post('/recoverPass')
    async recoverPass(@Body() dto: RecoverPassDto) {
        return await this.service.recoverPass(dto)
    }
}
