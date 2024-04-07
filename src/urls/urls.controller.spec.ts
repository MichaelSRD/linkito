import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

describe('UrlsController', () => {
  let controller: UrlsController;
  let service: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [{
        provide: UrlsService,
        useValue: {
          create: jest.fn().mockResolvedValue({
            url_corta: 'http://example.com'
          }),
          creatUrlTemp: jest.fn().mockResolvedValue({
            url_corta: 'http://example.com'
          }),
          findAll: jest.fn().mockResolvedValue('value'),

          redirect: jest.fn()

        }
      }],
    }).compile();

    service = module.get<UrlsService>(UrlsService)
    controller = module.get<UrlsController>(UrlsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create url',async ()=>{
    const createUrlDto = { url_original: 'http://example.com' };
    const user = { email: 'testuser@example.com',role:'user' };

    expect(await controller.create(createUrlDto,user)).toEqual({
      url_corta: 'http://example.com'
    });
    expect(service.create).toHaveBeenCalledWith(createUrlDto,user)
  })

  it('should create urlTemporal', async ()=>{
    const urltemp = { urloriginal: 'http://example.com' };

    expect(await controller.urlTemporal(urltemp)).toEqual({
      url_corta: 'http://example.com'
    })
    expect(service.creatUrlTemp).toHaveBeenCalledWith(urltemp)
  })

  it('should search  findAll',async () =>{
    const user = { email: 'correo@example.com', role:'user'};
    expect(await controller.findAll(user)).toBe('value')
    expect(service.findAll).toHaveBeenCalledWith(user)
  })

  it('slould redirect to the original URL ',async () =>{
    const url = 'https://www.google.com';
    const expetedRedirect = {url: 'https://www.google.com'};

    jest.spyOn(service,'redirect').mockImplementation(() => Promise.resolve(url));
    
    const result = await controller.redirect(url);

    expect(result).toEqual(expetedRedirect);
    expect(service.redirect).toHaveBeenCalledWith(url);
  })
  it('should return a 404 if the url is not found', async () =>{
    const url = 'https://www.notfound.com';
    const expetedRedirect = {url: '/404'};

    jest.spyOn(service,'redirect').mockImplementation(() => Promise.resolve(null));
    const result = await controller.redirect(url);

    expect(result).toEqual(expetedRedirect);
    expect(service.redirect).toHaveBeenCalledWith(url);
  })
  
});