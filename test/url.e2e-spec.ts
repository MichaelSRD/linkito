import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as bcryptjs from 'bcryptjs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Url } from '../src/urls/entities/url.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  const mockUsersRepository = {
    findOneBy: jest.fn().mockImplementation(async (email)=>{
      const password = 'test'
      const hashedPassword = await bcryptjs.hash(password,10);
      return {
        email,
        password: hashedPassword,
        role:'user'
      }
    })
  }
  const mockUrlsRepository = {
    findOneBy: jest.fn().mockImplementation(()=>{
      return null
    }),
    save: jest.fn().mockImplementation((dto) => { 
      return {
        id: Math.random() * (1000 - 1) + 1, 
        ...dto, 
      };
    }),
  }
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [

       {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
       },
       {
        provide: getRepositoryToken(Url),
        useValue:mockUrlsRepository,
       }
        
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init(); 

    const response =  await request(app.getHttpServer())
    .post('/auth/login')
    .send({email: 'msronayo05@gmail.com',password: 'password'})

    token = response.body.token;
    await app.get(getRepositoryToken(Url)).clear();
  }, 10000);

  it('/POST create', async() => {
    await request(app.getHttpServer())
      .post('/urls')
      .set({'Authorization':`Bearer ${token}`})
      .send({ url_original: 'http://examples.com' })
      .expect(201) 
  });
});

