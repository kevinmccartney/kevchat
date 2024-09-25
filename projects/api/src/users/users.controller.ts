import { Injectable } from '@nestjs/common';
import { User } from './models';

@Injectable()
export class UsersService {
  getAllUsers(): User[] {
    return [];
  }

  getUser(): User {
    return {
      firstName: 'Kevin',
      lastName: 'McCartney',
      id: '1',
      email: 'hello@kevinmccartney.is',
      avatarUrl:
        'https://media.licdn.com/dms/image/v2/C4E03AQFrt4YBflbtvQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1548424677629?e=1732147200&v=beta&t=cXdCRyz68zuGHXZnCL8l8wiim3patnhz31NFv87HYjo',
    };
  }
}
