import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { Binary } from 'mongodb';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true })
  email: string;
  @Prop({ type: String, default: null })
  avatarUrl: Nullable<string>;
  @Prop({ required: true })
  hashedPassword: Binary;
  @Prop({ required: true })
  salt: Binary;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDto = {
  _id: ObjectId;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: Nullable<string>;
};

export type CreateUserDto = Omit<UserDto, '_id'> & {
  /**
   * hashedPassword and salt will be generated by the service when creating a new user.
   */
  password: string;
};

// export type User = {
//   id: number;
//   username: string;
//   display_name: string;
//   location: string;
//   timezone: string;
//   statusMessage: string;
//   birthday: Date;
//   email: string;
//   hashed_password: Buffer;
//   salt: Buffer;
//   phone: string;
//   first_name: string;
//   last_name: string;
//   bio: string;
//   avatar: string;
//   created_at: Date;
//   updated_at: Date;
//   last_login: Date;
//   is_verified: boolean;
//   is_active: boolean;
//   roles: string[];
// };
