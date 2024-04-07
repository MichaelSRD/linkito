import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Urltemp } from './entities/urlTemp.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Url]),
  TypeOrmModule.forFeature([Urltemp])],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {

}
