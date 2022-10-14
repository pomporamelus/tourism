import { Controller, Get, Put, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../auth/guard/role-guard';
import { UpdateUserDto } from './dto';
import { UserRole } from './entities';
import { Role } from './entities/role-decorator';
import { UsersService } from './users.service';
@ApiBearerAuth()
@ApiTags('user')
@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService){}

    @Get()
    @Role(UserRole.ADMIN)
    @UseGuards(RoleGuard)
    async findAll(){
        return await this.UsersService.findAll()
    }

    @Put()
    async updateUser(@Body() dto: UpdateUserDto){
        return await this.UsersService.updateUser(dto)
    }

    @Get('admins')
    @Role(UserRole.SUPERADMIN)
    @UseGuards(RoleGuard)
    async findAdmins(){
        return await this.UsersService.findAdmins()
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number){
        return await this.UsersService.deleteUser(id)
    }

    @Delete('admin/:id')
    @Role(UserRole.SUPERADMIN)
    @UseGuards(RoleGuard)
    async deleteAdmin(@Param('id') id: number){
        return await this.UsersService.deleteAdmin(id)
    }
}
