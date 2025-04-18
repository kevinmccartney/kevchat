import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from 'src/kafka.module';

import { User, UserSchema } from 'src/users';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]) as DynamicModule,
    ClientsModule,
    KafkaModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
