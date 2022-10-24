import { Controller, Get, Put, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../auth/guard/role-guard';
import { UpdateUserDto } from './dto';
import { UserRole, UsersEntity } from './entities';
import {  Role } from './entities/role-decorator';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService){}

    @Get()
    @ApiOkResponse({ type: UsersEntity })
    @ApiForbiddenResponse({ description: 'No access' })
    @Role(UserRole.SUPERADMIN)
    @UseGuards(RoleGuard)
    async findAll(){
        return await this.UsersService.findAll()
    }

    @Put()
    @ApiOkResponse({ type: UpdateUserDto })
    @ApiNotFoundResponse({ description: 'User is not found' })
    @ApiBadRequestResponse({ description: 'Validation error' })
    @Role(UserRole.ADMIN, UserRole.SUPERADMIN,UserRole.USER)
    @UseGuards(RoleGuard)
    async updateUser(@Body() dto: UpdateUserDto){
        return await this.UsersService.updateUser(dto)
    }

    @Get('/admins')
    @ApiOkResponse({ type: UsersEntity })
    @ApiForbiddenResponse({ description: 'No access' })
    @Role(UserRole.SUPERADMIN)
    @UseGuards(RoleGuard)
    async findAdmins(){
        return await this.UsersService.findAdmins()
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'User is sucessfully deleted' })
    @ApiNotFoundResponse({ description: 'User is not found' })
    // @ApiForbiddenResponse({ description: 'No access' })
    // @Role(UserRole.ADMIN, UserRole.SUPERADMIN)
    // @UseGuards(RoleGuard)
    async deleteUser(@Param('id') id: number){
        return await this.UsersService.deleteUser(id)
    }

    @Delete('admin/:id')
    @ApiOkResponse({ description: 'Admin is sucessfully deleted' })
    @ApiNotFoundResponse({ description: 'User is not found' })
    @ApiBadRequestResponse({ description: 'This user is not admin' })
    @ApiForbiddenResponse({ description: 'No access' })
    @Role(UserRole.SUPERADMIN)
    @UseGuards(RoleGuard)
    async deleteAdmin(@Param('id') id: number){
        return await this.UsersService.deleteAdmin(id)
    }
}
