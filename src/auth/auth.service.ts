import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthLoginDto, AuthSignDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  userSignUp = async (authDto: AuthSignDto) => {
    try {
      const hash = await argon.hash(authDto.password);
      const userData = {
        firstName: authDto.firstName,
        lastName: authDto.lastName,
        email: authDto.email,
        password: hash,
      };
      const user = await this.prisma.user.create({ data: userData });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User Already Present!');
        }
      }
      console.log(error.message);
      throw error;
    }
  };

  userLogin = async (authDto: AuthLoginDto) => {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: authDto.email,
        },
      });

      if (!user) {
        throw new ForbiddenException('User Not Found!');
      }

      const pwdMatch = await argon.verify(user.password, authDto.password);

      if (!pwdMatch) {
        throw new ForbiddenException('Password is Incorrect!');
      }

      return this.loginToken(user.id, user.email);
    } catch (error) {
      throw error;
    }
  };

  loginToken = async (
    userId: string,
    emailId: string,
  ): Promise<{ access_token: string }> => {
    const payload = {
      sub: userId,
      email: emailId,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '20m',
      secret: secret,
    });

    return { access_token: token };
  };
}
