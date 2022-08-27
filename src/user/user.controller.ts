import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getInfo() {
    return 'caught me';
  }
}
