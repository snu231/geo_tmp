import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './dto/JwtPayload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ){

  }

  async create(createAuthDto: CreateAuthDto) : Promise<void>{
    const {userid, password} = createAuthDto;

    const userExist = await this.authRepository.findOne({
      where: {
        userid
      }
    })
    if(userExist) throw new UnprocessableEntityException("Already exists userid");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.authRepository.create({
      userid,
      password: hashedPassword
    });

    try{
      await this.authRepository.save(user);
    }catch(e){
      console.log(e);
    }

  }

  async signin(loginInfo: LoginDto) : Promise<string>{
    const {userid, password} = loginInfo;
    const user = await this.authRepository.findOne(
      {
        where: {
          userid
        }
      }
    );
    if(user && (await bcrypt.compare(password, user.password) )  )   {
      const payload : JwtPayload ={ userid};
      const accessToken = await this.jwtService.sign(payload);
      return accessToken;

    }else{
      throw new UnprocessableEntityException();

    }
  }

  async soft_signout(deleteAuthDto: LoginDto): Promise<string>{
    const { userid, password } = deleteAuthDto;
    const user = await this.authRepository.findOne({
      where: {
        userid
      }
    });
    if(user && (await bcrypt.compare(password, user.password)  ) ){

      await this.authRepository.softDelete(user.id );
      return '';
    }else{
            throw new UnauthorizedException('Searching auth failed');
        }

  }

  findAll() {
    return `This action returns all auth`;
  }

  async findOne(id: number): Promise<Auth> {
    return await this.authRepository.findOne({
      where: {
        id
      }
    })
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
