import { createHash } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../common/utils/jwt.util';
import { MOCK_CODES, MOCK_USERS, UserInfo } from '../../common/utils/mock-data';
import { forbiddenResponse } from '../../common/utils/response.util';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private codes = [...MOCK_CODES];
  private refreshTokenHashByUsername = new Map<string, string>();
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
    this.refreshTokenHashByUsername.set(
      findUser.username,
      this.hashToken(refreshToken),
    );

    return {
      ...this.sanitizeUser(findUser),
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken?: string) {
    if (refreshToken) {
      const user = verifyRefreshToken(refreshToken);
      if (user?.username) {
        this.refreshTokenHashByUsername.delete(user.username);
      }
    }
    return { message: 'ok' };
  }

  async refresh(refreshToken: string) {
    const user = verifyRefreshToken(refreshToken);

    if (!user) {
      forbiddenResponse('Invalid refresh token');
    }

    const findUser = this.users.find((item) => item.username === user.username);

    if (!findUser) {
      forbiddenResponse('User not found');
    }

    const expectedHash = this.refreshTokenHashByUsername.get(findUser.username);
    if (!expectedHash || expectedHash !== this.hashToken(refreshToken)) {
      this.refreshTokenHashByUsername.delete(findUser.username);
      forbiddenResponse('Invalid refresh token');
    }

    const accessToken = generateAccessToken(findUser);
    const newRefreshToken = generateRefreshToken(findUser);
    this.refreshTokenHashByUsername.set(
      findUser.username,
      this.hashToken(newRefreshToken),
    );

    return {
      ...this.sanitizeUser(findUser),
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private sanitizeUser(user: UserInfo) {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }
}
