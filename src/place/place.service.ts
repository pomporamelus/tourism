import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaceDto, UpdatePlaceDto } from './dto';
import { PlaceEntity, PlaceEnEntity} from './entity';
import { Language } from './enum';

@Injectable()
export class PlaceService {
    constructor(
        @InjectRepository(PlaceEntity) 
        private PlaceRepository: Repository<PlaceEntity>,
        @InjectRepository(PlaceEnEntity) 
        private PlaceEnRepository: Repository<PlaceEnEntity>){}

    async findAll(){
        const place = await this.PlaceRepository.find()

        return place
    }

    async createPlace(dto: CreatePlaceDto){
        const en = dto.en[0]
        delete dto.en

        const place = await this.PlaceRepository.save(dto)
        en.place_id = place.id

        await this.PlaceEnRepository.save(en)
        return place
    }

    async findAllEn(){
        const en = await this.PlaceEnRepository.find()
        return en
    }

    async find_one(id: number){
        const place = await this.PlaceRepository.findOne({
            where: {
                id: id
            }
        })

        if(!place){
            throw new NotFoundException('Place is not found')
        }

        return place
    }

    async findById(lang: string, id: number){
        const place = await this.find_one(id)

        if(lang == Language.EN){
            const place_en = await this.PlaceEnRepository.findOne({
                where: {
                    place_id: place.id
                }
            })

            delete place_en.place_id, place_en.id
            Object.assign(place, place_en)
            return place
        }

        return place
    }

    async findByName(lang: string, name: string){
        const place = await this.PlaceRepository.findOne({ 
            where: { 
                name: name
            }
        })

        if(!place){
            const place_en = await this.PlaceEnRepository.findOne({ 
                where: { 
                    name: name
                }
            })

            if(!place_en){
                throw new NotFoundException('Place is not found')
            }

            return this.findById(lang, place_en.place_id)
        }

        if(lang == Language.EN){
            return this.findById(lang, place.id)
        }

        return place
    }

    async update(dto: UpdatePlaceDto){
        if(dto.en){
            const en = dto.en[0]
            delete dto.en
            const place_en = await this.PlaceEnRepository.findOne({
                where: {
                    place_id: dto.id
                }
            })

            if(!place_en){
                throw new NotFoundException('Place is not found')
            }

            Object.assign(place_en, en)
            await this.PlaceEnRepository.save(place_en)
        }

        const place = await this.PlaceRepository.findOne({
            where: {
                id: dto.id
            }
        })

        if(!place){
            throw new NotFoundException('Place is not found')
        }

        Object.assign(place, dto)
        return await this.PlaceRepository.save(place)
    }

    async delete(id: number){
        const place = await this.find_one(id)

        await this.PlaceEnRepository.delete({ place_id: place.id })
        await this.PlaceRepository.delete(id)

        return {message: 'Place sucessfully deleted'}
    }

}
