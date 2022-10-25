import { ApiProperty } from "@nestjs/swagger";

export class RecoverPassDto{
    @ApiProperty({example:'name@gmail.com', description:'to recover your password'})
    email: string
    
    @ApiProperty({example:'shanks123'})
    newPassword: string
}