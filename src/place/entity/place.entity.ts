import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../enum";
import { IPlace } from "../inteface/place.interface";
import { PlaceEnEntity } from "./place-eng.entity";

@Entity()
export class PlaceEntity implements IPlace{
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'text'})
    name: string

    @Column({type: 'text'})
    description: string

    @Column({type: 'text'})
    images: string

    @Column({type: 'text'})
    address: string

    @Column({type: 'int', nullable: true})
    rating_avg: number
    
    @Column({ type: 'enum', enum: Category})
    category: Category
    
    @OneToOne(() => PlaceEnEntity, en => en.place)
    en: PlaceEnEntity[]

    @Column({type: 'text', nullable: true})
    reviews: string
}