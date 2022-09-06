import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Application')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getAppPage(): string {
    return this.appService.getAppPage();
  }
}
