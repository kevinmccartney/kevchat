import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { OidcModule } from 'nest-oidc-provider';
import { MongooseModule } from '@nestjs/mongoose';

import { HealthModule } from './health';
import { OidcConfigService, OidcConfigModule } from './oidc';
import { MethodNotAllowedMiddleware } from './middleware';
import { UsersModule } from './users';
import { SignupModule } from './signup';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    HealthModule,
    UsersModule,
    OidcModule.forRootAsync({
      imports: [OidcConfigModule],
      useExisting: OidcConfigService,
    }) as DynamicModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING as string, {
      autoIndex: false,
    }) as DynamicModule,
    SignupModule,
  ],
  controllers: [AuthController],
  providers: [MethodNotAllowedMiddleware],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly _httpAdapterHost: HttpAdapterHost) {}

  onApplicationBootstrap() {
    const middleware = new MethodNotAllowedMiddleware(this._httpAdapterHost);
    middleware.onApplicationBootstrap();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MethodNotAllowedMiddleware).forRoutes('*');
  }
}
