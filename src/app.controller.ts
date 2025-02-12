import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './auth/decorators/is-public.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('/api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPublic()
  @Get('health')
  async getHealthCheck() {
    return this.appService.getHealthCheck();
  }

  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
