import { ApiProperty } from "@nestjs/swagger"
import { Category, CategoryEn } from "../enum"


export class CreatePlaceDto{
    @ApiProperty({example: 'Бегемот'})
    name: string

    @ApiProperty({example: 'Точка быстрого питания'})
    description: string

    @ApiProperty({ example: 'place/begemot.jpg' })
    images: string

    @ApiProperty({example: 'https://bit.ly/3zb0wCR'})
    address: string

    @ApiProperty({example: 'Еда'})
    category: Category

    @ApiProperty({ example: [{
        name: 'Begemot',
        desctription: 'Fast food',
        category: 'Foods'
    }]})
    en: [{
        place_id?: number
        name: string
        description: string
        category: CategoryEn
    }]
}