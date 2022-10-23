import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEn } from "../enum";
import { PlaceEntity } from "./place.entity";

@Entity()
export class PlaceEnEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    place_id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    category: CategoryEn

    @OneToOne(() => PlaceEntity, place => place.en)
    place: PlaceEntity
}