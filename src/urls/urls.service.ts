import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import * as crypto from 'crypto';
import { Urltemp } from './entities/urlTemp.entity';
import { UrlTempDto } from './dto/urltemp-dto';
import { UserDto } from '../users/dto/user-dto';



@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url) private readonly urlRepository: Repository<Url>,
    private dataSource: DataSource,
    @InjectRepository(Urltemp) private readonly urlTempRepository:Repository<Urltemp>  
  ) {}

  async create(createUrlDto: CreateUrlDto,user: UserDto): Promise<{url_corta:string}> {
    const url = createUrlDto.url_original;
    try {
      const chaeckUrlInDB = await this.urlRepository.findOneBy({
        url_original: url,
      });
      if (chaeckUrlInDB) {
        throw new ConflictException('la url ya existe');
      }
      const dominio = 'https://linkito.onrender.com/urls/';

      const urlCorta = this.createUrlCorta(createUrlDto.url_original);

      const urlCompleta = dominio + urlCorta;
      await this.urlRepository.save({
        ...createUrlDto,
        url_corta: urlCorta,
        useremail: user.email
      });
      return { url_corta: urlCompleta };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error inesperado al crear URL:', error);
      throw new HttpException('Error interno del servidor', 500);
    }
  }

  findAll(user:UserDto) {
    return this.urlRepository.find({
      where:{useremail:user.email}
    });
  }

  async findOne(id: string): Promise<any> {
    try {
      const url = await this.urlRepository.findOneBy({ id });
      if (url) {
        return url;
      }
      throw new BadRequestException('no se encontro la url');
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateUrlDto: UpdateUrlDto,
  ): Promise<{ update: boolean; message: string }> {
    try {
      //Validar Url corta
      if (updateUrlDto.url_corta !== undefined) {
        const validateUrlCorta = this.validatedUrl(updateUrlDto.url_corta);
        if (!validateUrlCorta) {
          return {
            update: false,
            message:
              'la url corta es muy larga reduce los caracteres y vuelve a intentarlo',
          };
        }
      }
      // Validar ID
      const url = await this.urlRepository.findOneBy({ id });
      if (!url) {
        return {
          update: false,
          message: `no se encontró la URL con el id ${id}`,
        };
      }
      // Actualizar URL
      await this.urlRepository.update(id, updateUrlDto);
      return { update: true, message: 'Url actualizada correctamente' };
    } catch (error) {
      console.error(error);
      return { update: false, message: 'Error al actualizar la URL' };
    }
  }

  async remove(id: string): Promise<{ success: boolean; messge: string }> {
    try {
      await this.urlRepository.delete(id);
      return { success: true, messge: 'Url eliminado correctamente' };
    } catch (error) {
      return { success: false, messge: 'Error al eliminar la Url' };
    }
  }

  async redirect(url_corta: string): Promise<any> {
    // create a new query runner
    const queryRunner = this.dataSource.createQueryRunner()
  
    // establish real database connection using our new query runner
    await queryRunner.connect()
  
    // lets now open a new transaction:
    await queryRunner.startTransaction()
  
    try {
      const entidad = await queryRunner.manager.getRepository(Url).findOne({
        where: {
          url_corta: url_corta,
        },
        lock: { mode: "pessimistic_write" },
      });
      
      if (!entidad) {
        throw new BadRequestException(`no se encontróla URL ${url_corta}`)
      }
      // Aumentamos el valor de "clicks" en la entidad
      await queryRunner.manager.getRepository(Url).increment({ url_corta: url_corta }, 'clicks', 1);
  
      // commit transaction now:
      await queryRunner.commitTransaction()
  
      return entidad.url_original;
    } catch (err) {
      console.error(err)
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  }
  
  async creatUrlTemp(url: UrlTempDto): Promise<CreateUrlDto>{
      try {
        const existingUrl = await this.urlTempRepository.findOneBy({
          urloriginal: url.urloriginal
        })
        const existingUrltemp = await this.urlTempRepository.findOneBy({
          urloriginal: url.urloriginal
        })
        if(existingUrl || existingUrltemp){
          throw new BadRequestException('la url ya esta registrada')
        }
        const dominio = 'https://linkito.onrender.com/urls/p/';

        const urlCorta = this.createUrlCorta(url.urloriginal);

        const urlCompleta = dominio + urlCorta;
        await this.urlTempRepository.save({
            ...url,
            urlcorta:urlCorta,
            expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
       return {url_original:urlCompleta}
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('error en crear la url corta')
      }
  }

  async redirectTemp(url: string): Promise<string | null | undefined>{
        try {
           const findUrl = await this.urlTempRepository.findOneBy({
            urlcorta:url
           })
           if(!findUrl){
            throw new NotFoundException('url no encontrada')
           }

           return findUrl.urloriginal;
        } catch (error) {
          console.error(error);
        }
  }

  createUrlCorta(url: string) {
    const longitud = 5;
    const hash = crypto
      .createHash('sha256')
      .update(url)
      .digest('hex')
      .substring(0, longitud);
    return hash.toString();
  }
  
  validatedUrl(urlcorta: string) {
    const longitudMaxima = 9;
    return urlcorta.length <= longitudMaxima;
  }
}
