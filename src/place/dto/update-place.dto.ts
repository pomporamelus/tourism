import { Category, CategoryEn } from "../enum"

export class UpdatePlaceDto{
    id: number
    name: string
    description: string
    images: string
    address: string
    category: Category
    en: [{
        name: string
        description: string
        category: CategoryEn
    }]
}