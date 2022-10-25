import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DB_CONFIG } from './utils/db_config';
import { PlaceModule } from './place/place.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_CONFIG),
    UsersModule,
    AuthModule,
    PlaceModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
