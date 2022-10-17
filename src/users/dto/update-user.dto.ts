import { ApiProperty } from "@nestjs/swagger"
import { IsNumberString, Length } from "class-validator"

export class UpdateUserDto{

    id: number
    @ApiProperty({example: 'yourname@gmail.com'})
    email?: string
    @ApiProperty({example: 'islam azamatov'})
    name?: string
    @ApiProperty({example: '556335577'})
    @IsNumberString()
    @Length(9,10)
    phoneNumber?: string
    @ApiProperty({example: 'user123'})
    password?: string
 
    @ApiProperty({example: 'https://bit.ly/3Csmz8Q'})
    avatar?: string
}