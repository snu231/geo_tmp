import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Polygon } from 'geojson';
import { Auth } from 'src/auth/entities/auth.entity';
import {  Repository } from 'typeorm';
import { SetTmpPointDto } from './dto/set-tmpPoint.dto';
import { Poly } from './entities/location.entity';
import { Poi } from './entities/point.entity';
import { TmpPoint } from './entities/tmpgeojson.entity';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Poly)
        private polyRepository: Repository<Poly>,

        @InjectRepository(Poi)
        private pointRepository: Repository<Poi>,

        @InjectRepository(Auth)
        private authRepository: Repository<Auth>,

        @InjectRepository(TmpPoint)
        private tmpPointRepository: Repository<TmpPoint>

    ){}

    async setImage( user: Auth, file: Express.Multer.File ) : Promise<any>{

        console.log(file);

        const result = await this.authRepository.createQueryBuilder()
        .update({
            imageFileURL: file.filename
        }).where({
            id: user.id
        }).execute();

        console.log(result);

        return result.raw;
    }

    async setGeometry( geometry  ): Promise<any>{

        let {type, coordinates } = geometry;

        if( type=='Polygon' ){
        const geometry : Polygon = {
            type,
            coordinates: [ coordinates[0].map(coor =>  coor.reverse() 
            )  ]
        }
        const object= await this.polyRepository.create({
            polygon: geometry
        });
        await this.polyRepository.save(object);
    }else if( type=='Point'){ 
        const object = await this.pointRepository.create({
            point: {
                type,
                coordinates: coordinates.reverse()
            }
        })
        await this.pointRepository.save(object);
    }

    }

    async setTmpPoints( tmpInfo: SetTmpPointDto ) : Promise<void>{

        const {x, y, floor} = tmpInfo;

        console.log("__--")
        
        const object = await this.tmpPointRepository.create({
            point: {
                type: 'Point',
                coordinates: [ y, x]
            },
            floor
        });

        console.log("__--")

        await this.tmpPointRepository.save(object);

    }

    async getPoly(id: number) : Promise<any> {

        let poly =  await this.polyRepository.findOne({
            where:{id}
        });

        console.log(poly.polygon  )
        return poly;
    }

    async getAllPoints() : Promise<any>{
        const query = await this.pointRepository.createQueryBuilder('');

        console.log("--")
        return await query.getMany();

    }

    async getPoint(id: number) : Promise<any> {

        let point =  await this.pointRepository.findOne({
            where:{id}
        });
        if(!point) throw new UnprocessableEntityException("Doesn't exist");

        //console.log( point.point  )
        return point;
    }

    

    
}
