import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { typeORMConfig } from './configs/typeorm.config';
import { LocationModule } from './location/location.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),

    AuthModule,

    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
