import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async createToken() {
    //return this.jwtService.sign()
  }

  async validateToken(token: string) {
    return this.jwtService.verify(token);
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

    return user;
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

  async reset(password: string, token: string) {
    //TODO: Check if token is valid

    //Get the id from the token

    const id = 0;

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  }
}
