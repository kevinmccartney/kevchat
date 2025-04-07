import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HealthModule } from './health';
import { UsersModule } from 'src/users/users.module';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [
    HealthModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING as string, {
      autoIndex: false,
    }) as DynamicModule,
    UsersModule,
    ConversationsModule,
  ],
})
export class AppModule {}
