import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('healthz')
export class HealthController {
  constructor(
    private readonly _health: HealthCheckService,
    private readonly _mongoose: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this._health.check([
      () => this._mongoose.pingCheck('mongodb', { timeout: 1500 }),
    ]);
  }
}
