import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Auth } from '../entities/auth.entity';

import * as config from 'config';
import { JwtPayload } from '../dto/JwtPayload.interface';
import { Repository } from 'typeorm';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(Auth)
        private userRepository : Repository<Auth>
    ){
        super({
            secretOrKey : jwtConfig.secret,

            
            
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    //console.log(request?.cookies);
                    return request?.cookies?.Authentication;
                },
            ]),
        })
    }

    async validate(payload : JwtPayload ) : Promise<Auth> {
        const {userid} = payload;

        //console.log(  userID );

        const user: Auth = await this.userRepository.findOne( {
            where: {userid
            }} );


        if(!user) throw new UnauthorizedException();

        return user;
    }

}