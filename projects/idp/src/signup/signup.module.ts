import { Module } from '@nestjs/common';

import { SignupController } from './signup.controller';
import { UsersModule } from 'src/users';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [SignupController],
  imports: [UsersModule, HttpModule],
})
export class SignupModule {}
