import {  PartialType, } from '@nestjs/mapped-types';
import { CreateUrlDto } from './create-url.dto';
import { IsOptional, IsString } from 'class-validator';


export class UpdateUrlDto extends PartialType(CreateUrlDto) {
    @IsString()
    @IsOptional()
    url_corta: string
}
