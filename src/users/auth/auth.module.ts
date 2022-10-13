import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users.module';
import { UsersService } from '../users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
    secret: process.env.PRIVATE_KEY || 'SECRET',
    signOptions : {
      expiresIn: '7d'
    }
  })],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [ JwtModule]
})
export class AuthModule {}
