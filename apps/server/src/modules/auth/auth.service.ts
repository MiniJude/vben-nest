import { Injectable } from '@nestjs/common';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../common/utils/jwt.util';
import { MOCK_CODES, MOCK_USERS, UserInfo } from '../../common/utils/mock-data';
import { forbiddenResponse } from '../../common/utils/response.util';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  private codes = [...MOCK_CODES];
  private users = [...MOCK_USERS];

  async getCodes(username: string) {
    const findCodes = this.codes.find((item) => item.username === username);

    if (!findCodes) {
      return [];
    }

    return findCodes.codes;
  }

  getUserByUsername(username: string): undefined | UserInfo {
    return this.users.find((item) => item.username === username);
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const findUser = this.users.find(
      (item) => item.username === username && item.password === password,
    );

    if (!findUser) {
      forbiddenResponse();
    }

    const accessToken = generateAccessToken(findUser);
    const refreshToken = generateRefreshToken(findUser);

    return {
      ...findUser,
      accessToken,
      refreshToken,
    };
  }

  async logout() {
    return { message: 'ok' };
  }

  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      forbiddenResponse('Invalid refresh token');
    }

    const findUser = this.users.find(
      (item) => item.username === payload.username,
    );

    if (!findUser) {
      forbiddenResponse('User not found');
    }

    const accessToken = generateAccessToken(findUser);
    const newRefreshToken = generateRefreshToken(findUser);

    return {
      ...findUser,
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
