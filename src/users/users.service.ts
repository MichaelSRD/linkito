import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}

  async findAll(): Promise<CreateUserDto[]> {
    try {
      const users =  await this.userRepository.find();
      return users
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al obtener usuarios')
    }
  }
  
  async createUser(datos: CreateUserDto): Promise<User>{
      try {
        const user = await this.userRepository.save(datos)
        return user;
      } catch (error) {
        console.error(error)
        throw new InternalServerErrorException();
      }
  }

  async findOne(id: string): Promise<CreateUserDto | null> {
    try {
      const user = await this.userRepository.findOneBy({id});
      return user;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al obtener el usuario');
    }
    
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UpdateUserDto | undefined> {
    try {
      const usuarioParaActualizar  = await this.userRepository.findOneBy({id});
      if (!usuarioParaActualizar ) {
        throw new NotFoundException('Usuario no encontrado')
      }
      await this.userRepository.update(id,updateUserDto);
      return usuarioParaActualizar;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') { // Manejar posibles errores de claves duplicadas
        throw new BadRequestException('Datos de usuario duplicados');
      } else {
        console.error(error); // Registrar el error para depuración
        throw new InternalServerErrorException('Error actualizando usuario')
      }
    }
    
  }

  async remove(id: string): Promise<boolean> {
    try {
      const userToDelete = await this.userRepository.findOneBy({id})
      if(!userToDelete){
        throw new NotFoundException('Usuario no encontrado');
      }
      await this.userRepository.remove(userToDelete);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error eliminando usuario');
    }
  }
  async findOneToEmail(email:string): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({email});
      if(!user){
        throw new NotFoundException('Usuario no encontrado');
      }
      return user
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('error al buscar el usuario')
    }
}
 async usuarioDisponible(email: string):Promise<boolean>{
 
    const user = await this.userRepository.findOneBy({email})
    if (user) {
       return true;
    }
   return false;
 }
}
