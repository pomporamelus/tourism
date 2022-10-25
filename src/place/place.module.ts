import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceEnEntity, PlaceEntity,  } from './entity';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceEntity, PlaceEnEntity])],
  controllers: [PlaceController],
  providers: [PlaceService]
})
export class PlaceModule {}
