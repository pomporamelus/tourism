import { Category, CategoryEn } from "../enum"


export class CreatePlaceDto{
    name: string
    description: string
    images: string
    address: string
    category: Category
    en: [{
        place_id?: number
        name: string
        description: string
        category: CategoryEn
    }]
}