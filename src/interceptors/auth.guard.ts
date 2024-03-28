import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { authorization } = req.headers;

    try {
      const data = this.authService.validateToken(authorization?.split(' ')[1]);
      const user = await this.userService.findOne(data.id);

      req.tokenPayload = data;
      req.user = user;

      return true;
    } catch (error) {
      return false;
    }
  }
}
