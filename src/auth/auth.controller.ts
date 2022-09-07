import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthSignDto } from './dto';

//{ path: 'auth', version: '1' }
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async userSignUp(@Body() authDto: AuthSignDto) {
    return this.authService.userSignUp(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/log-in')
  async userLogIn(@Body() authDto: AuthLoginDto) {
    return this.authService.userLogin(authDto);
  }
}
