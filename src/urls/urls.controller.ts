import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Public } from '../auth/decorators/public-decorator';
import { activeUser } from '../auth/decorators/activeUser.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/auth-guard/roles.guard';
import { UrlTempDto } from './dto/urltemp-dto';
import { UserDto } from '../users/dto/user-dto';

@Controller('urls')
@Roles(Role.User)
@UseGuards(RolesGuard)
export class UrlsController { 
  constructor(private readonly urlsService: UrlsService) {}
  
  @Post()
  create(@Body() createUrlDto: CreateUrlDto,@activeUser() user: UserDto) {
    return this.urlsService.create(createUrlDto,user);
  }

  @Public()
  @Post('prueba')
  urlTemporal(@Body() urlTemp: UrlTempDto){
     return this.urlsService.creatUrlTemp(urlTemp)
  }
 
  @Get()
  findAll(@activeUser() user: UserDto) {
    return this.urlsService.findAll(user);
  }
  
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('user/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.urlsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateUrlDto: UpdateUrlDto) {
    return this.urlsService.update(id, updateUrlDto);
  }
  
  @Get(':url')
  @Redirect()
  @Public()
   async redirect(@Param('url') url: string){
    const ruta = await this.urlsService.redirect(url) 
    if (!ruta) {
      return { url: '/404' }; // Redireccionar a una página de 404
    }
    return { url: ruta }
  }
  
  @Get('p/:url')
  @Redirect()
  @Public()
   async redirectTemp(@Param('url') url: string){
    const ruta = await this.urlsService.redirectTemp(url) 
    if (!ruta) {
      return { url: '/404' }; // Redireccionar a una página de 404
    }
    return { url: ruta }
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.urlsService.remove(id);
  }
}
