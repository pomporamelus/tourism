import { Controller, Get, Put, Body, Delete, Param } from '@nestjs/common';
import { UpdateUserDto } from './dto';
import { UserRole } from './entities';
import { Role } from './entities/role-decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService){}

    @Get()
    @Role(UserRole.ADMIN)
    async findAll(){
        return await this.UsersService.findAll()
    }

    @Put()
    async updateUser(@Body() dto: UpdateUserDto){
        return await this.UsersService.updateUser(dto)
    }

    @Get('admins')
    @Role(UserRole.SUPERADMIN)
    async findAdmins(){
        return await this.UsersService.findAdmins()
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number){
        return await this.UsersService.deleteUser(id)
    }

    @Delete('admin/:id')
    @Role(UserRole.SUPERADMIN)
    async deleteAdmin(@Param('id') id: number){
        return await this.UsersService.deleteAdmin(id)
    }
}
