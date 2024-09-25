import { Controller, Get } from '@nestjs/common';

@Controller('healthz')
export class HealthController {
  @Get()
  getHealth(): { [key: string]: string } {
    return { message: 'KevChat API is up!' };
  }
}
