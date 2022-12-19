import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppPage = (): string => {
    return 'Welcome To NeoMEET';
  };
}
