import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from 'src/auth/auth.module';
import { Auth } from 'src/auth/entities/auth.entity';
import { Poly } from './entities/location.entity';
import { Poi } from './entities/point.entity';
import { TmpPoint } from './entities/tmpgeojson.entity';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Poly, Poi, Auth, TmpPoint]),
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    })

  ],
  controllers: [LocationController],
  providers: [LocationService]
})
export class LocationModule {}
