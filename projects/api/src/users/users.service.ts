import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, User, UserDto } from 'src/users/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private _userModel: Model<User>) {}

  async create(createUserInput: CreateUserDto): Promise<UserDto> {
    const createdUser = await this._userModel.create(createUserInput);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, ...user } = createdUser.toObject();

    return user;
  }
}
