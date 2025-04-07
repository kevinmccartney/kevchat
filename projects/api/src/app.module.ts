import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HealthModule } from './health';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    HealthModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING as string, {
      autoIndex: false,
    }) as DynamicModule,
    UsersModule,
  ],
})
export class AppModule {}
