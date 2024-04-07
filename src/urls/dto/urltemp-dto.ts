import { IsNotEmpty, IsString } from "class-validator";
import { IsUrlValid } from "../validateUrl";

export class UrlTempDto {
    
    @IsNotEmpty()
    @IsString()
    @IsUrlValid()
    urloriginal:string
}