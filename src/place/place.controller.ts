import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePlaceDto, UpdatePlaceDto } from './dto';
import { PlaceService } from './place.service';

@ApiBearerAuth()
@ApiTags('place')
@Controller(':lang/place')
export class PlaceController {
    constructor(private PlaceService: PlaceService){}

    @Get()
    async findAll(){
        return await this.PlaceService.findAll()
    }

    @Post()
    async create(@Body() dto: CreatePlaceDto){
        return await this.PlaceService.createPlace(dto)
    }

    @Get('/en')
    async findAllEn(){
        return await this.PlaceService.findAllEn()
    }

    @Get('findById/:id')
    async findById(@Param('lang') lang: string, @Param('id') id: number){
        return await this.PlaceService.findById(lang, id)
    }

    @Get('findByName/:name')
    async findByName(@Param('lang') lang: string, @Param('name') name: string){
        return await this.PlaceService.findByName(lang, name)
    }

    @Post()
    async update(@Body() dto: UpdatePlaceDto){
        return await this.PlaceService.update(dto)
    }

    @Delete(':id')
    async delete(@Param('id') id: number){
        return await this.PlaceService.delete(id)
    }
}
