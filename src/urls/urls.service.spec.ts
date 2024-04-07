import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Urltemp } from './entities/urlTemp.entity';
import { DataSource } from 'typeorm';
import { CreateUrlDto } from './dto/create-url.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { UpdateUrlDto } from './dto/update-url.dto';

describe('UrlsService', () => {
  let service: UrlsService;
  const mockUrlsRepository = {
    save: jest.fn().mockImplementation((dto) => { 
      return {
        id: Math.random() * (1000 - 1) + 1, 
        ...dto, 
      };
    }),
    update: jest.fn().mockImplementation((id,dto)=>{
      return {
        id: id, 
        ...dto, 
      };
    }),
    findOneBy: jest.fn().mockImplementation(()=>{
      return null;
    }),
    find: jest.fn().mockImplementation(()=>{
      return {
        id: Math.random()*(1000 - 1)+1,
        url_original: 'http://originalurl.com',
        url_corta: 'http://cortaUrl.com',
        useremail: 'useremail@.com'
      }
    })
   
  };
  const mockUrlsTempRepository = {};
  const mockDataSource = {};
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
         provide: getRepositoryToken(Url),
         useValue: mockUrlsRepository,
      },
      {
        provide: getRepositoryToken(Urltemp),
        useValue: mockUrlsTempRepository,
      },
      {
        provide: DataSource, // Asegúrate de importar DataSource desde el lugar correcto
        useValue: mockDataSource,
      }
    ],
      
    }).compile();

    service = module.get<UrlsService>(UrlsService);
  });

  it('should create a url',async ()=>{
    const createUrlDto: CreateUrlDto = {
      url_original: 'http://example.com'
    };
    const user = {email: 'email@example.com', role:'user'}

   const result = await service.create(createUrlDto,user)
    expect(result.url_corta.startsWith('http://localhost:3000/urls/')).toBe(true);
  })
  it('should throw ConflictException when URL already exists',async ()=>{
    const createUrlDto: CreateUrlDto = {
      url_original: 'http://example.com'
    };
    const user = {email: 'email@example.com', role:'user'};

    mockUrlsRepository.findOneBy.mockResolvedValue(true)

    await expect(service.create(createUrlDto,user)).rejects.toThrow(ConflictException)

  })
  it('should find all user urls',async ()=>{
    const user = {email: 'email@example.com', role:'user'}

    expect(await service.findAll(user)).toEqual({
      id: expect.any(Number),
      url_original: 'http://originalurl.com',
      url_corta: 'http://cortaUrl.com',
      useremail: 'useremail@.com'
    })
  })
  it('should return null when no urls are found for a specific user ',async ()=>{
    const user = {email: 'email@example.com', role:'user'}
    mockUrlsRepository.find.mockReturnValue(null);
    expect(await service.findAll(user)).toBe(null);
  })

  it('should find url to id ',async()=>{
    const idurl = '12345';
    mockUrlsRepository.findOneBy.mockResolvedValue({
      id: '12345',
      url_original: 'http://originalurl.com',
      url_corta: 'http://cortaUrl.com',
      useremail: 'useremail@.com'
    })
    expect(await service.findOne(idurl)).toEqual({
      id: '12345',
      url_original: 'http://originalurl.com',
      url_corta: 'http://cortaUrl.com',
      useremail: 'useremail@.com'
    })
    
  })
  it('should throw BadRequestException when the url id is not found', async()=>{
    const idurl = '12345';
    mockUrlsRepository.findOneBy.mockRejectedValue(new BadRequestException());
    await expect(service.findOne(idurl)).rejects.toThrow(BadRequestException)
  })
  
  it('should update url',async ()=>{
    const update: UpdateUrlDto = {
       url_corta: 'corta',
       url_original:'original'
    }
    const id = '12345';
    mockUrlsRepository.findOneBy.mockResolvedValue({
      id: '12345',
      url_original: 'http://originalurl.com',
      url_corta: 'http://cortaUrl.com',
      useremail: 'useremail@.com'
    })

    expect(await service.update(id,update)).toEqual({
      update: true, message: 'Url actualizada correctamente'
    })
    
  })

});
