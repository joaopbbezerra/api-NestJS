import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    //This uses the reflection pattern to access the decorators
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY, //This is to get if this decorator was used
      [context.getHandler(), context.getClass()],
      //This is where we pass the targets: The manipulator,
      // the decorator and could get also the args.
      // The handlers are our handler routes. The class would be used if we pass the decorator in the class.
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const rolesFiltered = requiredRoles.filter((role) => role === user.role);

    return rolesFiltered.length > 0;
  }
}
