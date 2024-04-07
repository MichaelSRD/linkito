import { IsNotEmpty, IsString } from "class-validator"


export class registerDto{
    
    @IsString()
    @IsNotEmpty()
    username:  string
    
    @IsString()
    @IsNotEmpty()
    email: string
     
    @IsString()
    @IsNotEmpty()
    password: string
    
}