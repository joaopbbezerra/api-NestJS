import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  createToken(user: User) {
    return this.jwtService.sign(
      {
        sub: user.id,
        name: user.name,
        email: user.email,
        id: user.id,
      },
      {
        expiresIn: '7 days',
        issuer: 'login',
        audience: 'Users',
      },
    );
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        audience: 'Users',
        issuer: 'login',
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  isValidToken(token: string) {
    try {
      return !!this.validateToken(token);
    } catch (e) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    //We just need to send the email - To avoid db scan we can send a message to the user saying that if it's a valid email, it will be send
    return true;
  }

  async reset(password: string) {
    //TODO: Check if token is valid

    //Get the id from the token

    const id = 0;

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDto) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
