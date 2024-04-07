import { IsNotEmpty, IsString } from "class-validator"

export class signDto{
     @IsNotEmpty()
     @IsString()
     email: string

     @IsNotEmpty()
     @IsString()
     password:string
}