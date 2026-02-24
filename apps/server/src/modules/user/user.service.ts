import { Injectable } from '@nestjs/common';

import { MOCK_USERS, UserInfo } from '../../common/utils/mock-data';

@Injectable()
export class UserService {
  private users = [...MOCK_USERS];

  getInfo(username: string): undefined | UserInfo {
    return this.users.find((item) => item.username === username);
  }
}
