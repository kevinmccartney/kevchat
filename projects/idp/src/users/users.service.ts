import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes, pbkdf2Sync } from 'crypto';

import { CreateUserDto, User, UserDto } from './user.model';
import { Binary } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private _userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const inputSalt = randomBytes(16);
    const inputHashedPassword = pbkdf2Sync(
      createUserDto.password,
      inputSalt,
      310000,
      32,
      'sha256',
    );
    const createUserInput = {
      hashedPassword: inputHashedPassword,
      salt: inputSalt,
      username: createUserDto.username,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      avatarUrl: createUserDto.avatarUrl ?? null,
    };

    const createdUser = await this._userModel.create(createUserInput);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, hashedPassword, salt, ...user } = createdUser.toObject();

    return user;
  }

  async findByUsername(username: string): Promise<Nullable<UserDto>> {
    if (!username) {
      return null;
    }

    const userQuery = await this._userModel.findOne({ username }).exec();

    if (!userQuery) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, hashedPassword, salt, ...user } = userQuery.toObject();

    return user;
  }

  async findOne(id: string): Promise<Nullable<UserDto>> {
    const userQuery = await this._userModel.findOne({ _id: id }).exec();

    if (!userQuery) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, hashedPassword, salt, ...user } = userQuery.toObject();

    return user;
  }

  async findAll(): Promise<UserDto[]> {
    const userQuery = await this._userModel.find().exec();

    return userQuery.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __v, hashedPassword, salt, ...userWithoutSensitiveData } =
        user.toObject();

      return userWithoutSensitiveData;
    });
  }

  async getHashedPassword(
    id: string,
  ): Promise<Nullable<{ hashedPassword: Binary; salt: Binary }>> {
    const userQuery = await this._userModel.findOne({ _id: id }).exec();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, salt } = userQuery?.toObject() || null;

    return !!(hashedPassword && salt) ? { hashedPassword, salt } : null;
  }

  // async update(
  //   id: string,
  //   updateUserDto: CreateUserDto,
  // ): Promise<Nullable<UserDto>> {
  //   try {
  //     const userQuery = await this._userModel
  //       .findByIdAndUpdate({ _id: id }, updateUserDto, { new: true })
  //       .exec();

  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { __v, hashedPassword, salt, ...user } = userQuery.toObject();

  //     return user;
  //   } catch (err) {
  //     console.log('Error while updating user:', err);
  //   }
  // }

  // async delete(id: string): Promise<Nullable<UserModel>> {
  //   const deletedUser = await this._userModel
  //     .findByIdAndDelete<UserModel>({ _id: id })
  //     .exec();

  //   return deletedUser;
  // }
}
