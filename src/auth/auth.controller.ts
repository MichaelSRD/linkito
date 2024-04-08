import { Body, Controller, HttpCode, HttpStatus, Post, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signDto } from './dto/sign-dto';
import { registerDto } from './dto/register-dto';
import { Public } from './decorators/public-decorator';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @Public()
    signIn(@Body() signInDto: signDto){
       return this.authService.signIn(signInDto)
    }
    
    @Public()
    @Post('register')
    register(@Body() register: registerDto){
      return this.authService.register(register)
    }
}
