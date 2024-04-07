import { Module, forwardRef } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Urltemp } from './entities/urlTemp.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Url]),
  TypeOrmModule.forFeature([Urltemp]), forwardRef(()=>AuthModule) ],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {

}
