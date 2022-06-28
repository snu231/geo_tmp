import { Body, Controller, Get, Param, Post, Sse,  UploadedFile, UseGuards, UseInterceptors, MessageEvent, StreamableFile, Res, Header } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { interval, map, Observable } from 'rxjs';
import { Auth } from 'src/auth/entities/auth.entity';
import { AuthUserGuard } from 'src/auth/jwt/auth.guard';
import { GetUser } from 'src/auth/jwt/get-user.decorator';
import { multerOptions } from 'src/lib/multerOptions';
import { SetTmpPointDto } from './dto/set-tmpPoint.dto';
import { LocationService } from './location.service';
import { Response } from 'express';

@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService ){

    }

    
    @Post('/geometry')
    async setGeometry(@Body() geometry  ) : Promise<any>{

        return await this.locationService.setGeometry(geometry);

    }

    @Post('/tmpgeometry')
    async setTmpPoints(@Body() tmpInfo : SetTmpPointDto ) : Promise<any>{
        
        return await this.locationService.setTmpPoints(tmpInfo);

    }
    @Post('userinfo')
    @UseGuards(AuthUserGuard)
    async getuserInfo( @GetUser() user: Auth ) : Promise<Auth> {

        console.log(user);

        return user;
    }


    @Post('/file')
    @UseGuards(AuthUserGuard)
    @UseInterceptors(FileInterceptor('image',  multerOptions ))
    async uploadImage( @GetUser() user: Auth,  @UploadedFile() file: Express.Multer.File  ) : Promise<any> {

        return await this.locationService.setImage(user, file );

    }

    @Get('polygon/:id')
    async getPoly(@Param('id') id: number ): Promise<any> {

        return await this.locationService.getPoly(id);
    }

    @Get('point/:id')
    async getPoint(@Param('id') id: number ): Promise<any> {

        return await this.locationService.getPoint(id);
    }

    @Get('tmpgeometry')
    async getAllPoints():Promise<any>{

        return await this.locationService.getAllPoints();
    }

}
