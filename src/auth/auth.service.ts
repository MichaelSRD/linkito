import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { signDto } from './dto/sign-dto';
import { JwtService } from '@nestjs/jwt';
import { registerDto } from './dto/register-dto';
import * as bcryptjs from "bcryptjs";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UsersService,
        private readonly jwtService: JwtService){}
    
    async register(datos: registerDto): Promise<any>{
        try {
            const userExist = await this.userService.usuarioDisponible(datos.email)
            if(userExist){
                throw new ConflictException('el correo electronico ya se encuentra registrado');
            }
            const { email,username,password } = datos;
            const hashedPassword = await bcryptjs.hash(password,10);
            const saveUser = await this.userService.createUser(
            {   email,
                username,
                password: hashedPassword
            });
            return saveUser;
        } catch (error) {
            throw error
        }
    }
    async signIn(
         {email,
         password
        }:signDto
       ): Promise<any>{
        const user = await this.userService.findOneToEmail(email)
        const isPasswordValid = await bcryptjs.compare(password, user.password )
        if (!isPasswordValid) {
            throw new UnauthorizedException('error en la contraseña');
        }
        const payload = {email: user.email, role: user.role}
        const token = await this.jwtService.signAsync(payload)
        return {
            role:user.role,
            email:user.email,
            token
        };
    }
}
