import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";


export class loginUserDto {
    @ApiProperty({example: 'yourname@gmail.com'})
    email: string
    
    @ApiProperty({example: '12345', description: 'password to login you'})
    @IsString({message: 'must be string'})
    @Length(4, 16, {message: 'no less 4 and no more 16 letters'})
    password: string;
}