import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Category, CategoryEn } from "../enum"

export class UpdatePlaceDto{
    @ApiProperty({example: 12 })
    id: number

    @ApiPropertyOptional({example: 'Wok лагман'})
    name: string

    @ApiPropertyOptional({example: 'Точка быстрого питания'})
    description: string

    @ApiPropertyOptional({example: 'place/wok-lagman.jpg'})
    images: string

    @ApiPropertyOptional({example: 'https://bit.ly/3Drob4p'})
    address: string

    @ApiPropertyOptional({example: 'Еда'})
    category: Category

    @ApiPropertyOptional({ example: [{
        name: 'Wok lagman',
        desctription: 'Fast food',
        category: 'Foods'
    }]})
    en: [{
        name: string
        description: string
        category: CategoryEn
    }]
}