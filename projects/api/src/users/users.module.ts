import { DynamicModule, Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from 'src/users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.model';

export const KAFKA_SERVICE = 'KAFKA_SERVICE';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]) as DynamicModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
