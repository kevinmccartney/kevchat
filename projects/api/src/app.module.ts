import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HealthModule } from './health';

@Module({
  imports: [
    HealthModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING as string, {
      autoIndex: false,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
