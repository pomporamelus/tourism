import { Controller, Get, Put, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../auth/guard/role-guard';
import { UpdateUserDto } from './dto';
import { UserRole } from './entities';
import {  Roles } from './entities/role-decorator';
import { UsersService } from './users.service';
@ApiBearerAuth()
@ApiTags('user')
@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService){}

    @Get()
    @Roles('super admin')
     @UseGuards(RoleGuard)
    async findAll(){
        return await this.UsersService.findAll()
    }

    @Put()
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN,UserRole.USER)
    @UseGuards(RoleGuard)
    async updateUser(@Body() dto: UpdateUserDto){
        return await this.UsersService.updateUser(dto)
    }

    @Get('/admins')
    @Roles(UserRole.SUPERADMIN)
    @UseGuards(RoleGuard)
    async findAdmins(){
        return await this.UsersService.findAdmins()
    }

    @Delete(':id')
    // @Role(UserRole.ADMIN, UserRole.SUPERADMIN)
    // @UseGuards(RoleGuard)
    async deleteUser(@Param('id') id: number){
        return await this.UsersService.deleteUser(id)
    }

    @Delete('admin/:id')
    @Roles(UserRole.SUPERADMIN)
    @UseGuards(RoleGuard)
    async deleteAdmin(@Param('id') id: number){
        return await this.UsersService.deleteAdmin(id)
    }
}
