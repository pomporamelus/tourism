import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
@ApiTags('authorization')
@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {}
    
}
