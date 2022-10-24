import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsNumberString, Length } from "class-validator"

export class UpdateUserDto{
    @ApiProperty()
    id: number

    @ApiPropertyOptional({example: 'yourname@gmail.com'})
    @IsEmail()
    email: string

    @ApiPropertyOptional({example: 'islam azamatov'})
    name: string

    @ApiPropertyOptional({example: '556335577'})
    @IsNumberString()
    @Length(9,10)
    phoneNumber: string
    
    @ApiPropertyOptional({example: 'user123'})
    password: string
 
    @ApiPropertyOptional({example: 'https://bit.ly/3Csmz8Q'})
    avatar: string
}