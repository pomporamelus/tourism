import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { UsersEntity } from "src/users/entities"

require('dotenv').config()

export const DB_CONFIG : TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [UsersEntity],
    autoLoadEntities: true,
    synchronize:true,
    // ssl : {
    //     rejectUnauthorized: false
    // }
}