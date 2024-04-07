import { IsNotEmpty, IsString } from "class-validator";
import { IsUrlValid } from "../validateUrl";

export class CreateUrlDto {
    @IsNotEmpty()
    @IsString()
    @IsUrlValid()
    url_original:string
}
