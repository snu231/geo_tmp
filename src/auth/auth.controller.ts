import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ValidationPipe, UsePipes } from '@nestjs/common';
import { Response  } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async create(@Body(ValidationPipe ) createAuthDto: CreateAuthDto): Promise<void> {
    return await this.authService.create(createAuthDto);
  }

  @Post('/signin')
  async singin( @Body(ValidationPipe) logindto: LoginDto, @Res({passthrough: true})  res: Response  ) : Promise<any> {

    const token = await this.authService.signin(logindto);

    await res.cookie('Authentication', token, {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'none'
      
    })

    await res.send();

  }

  @Delete('/logout')
  async logout(@Res({passthrough: true}) res : Response ): Promise<any> {
    const token = '';

        res.cookie('Authentication', token, {
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            maxAge: 0,
        });

  }

  @Delete('/signout')
  async signout(@Body(ValidationPipe) deleteAuthDto: CreateAuthDto, @Res({passthrough:true}) res: Response  ) : Promise<void>{
    const token = await this.authService.soft_signout(deleteAuthDto);
    res.cookie('Authentication', token, {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: 0,
  });


  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<Auth> {
    return await  this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
