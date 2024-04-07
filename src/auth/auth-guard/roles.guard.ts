import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../role.enum';
import { IS_PUBLIC_KEY } from '../decorators/public-decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isPublico = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,[
      context.getHandler(),
      context.getClass(),
    ]);
    if(isPublico){
      return true;
    }
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if(user.role === Role.Admin){
      return true;
    }
    return user.role === requiredRoles;
  }
}