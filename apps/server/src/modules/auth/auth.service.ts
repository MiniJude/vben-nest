import { createHash } from 'node:crypto';
import { env } from 'node:process';

import { Injectable } from '@nestjs/common';

import {
  generateAccessToken,
  generateRefreshToken,
  decodeRefreshToken,
} from '../../common/utils/jwt.util';
import { PrismaService } from '../../common/prisma/prisma.service';
import { forbiddenResponse } from '../../common/utils/response.util';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getCodes(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { permissionCodes: { select: { code: true } } },
    });
    return user?.permissionCodes?.map((c) => c.code) ?? [];
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        homePath: true,
        id: true,
        passwordHash: true,
        realName: true,
        roles: { select: { role: { select: { code: true } } } },
        username: true,
      },
    });

    if (!user || user.passwordHash !== this.hashPassword(password)) {
      forbiddenResponse();
    }

    const accessToken = generateAccessToken({ username: user.username });
    const refreshToken = generateRefreshToken({ username: user.username });
    await this.prisma.refreshToken.upsert({
      create: { tokenHash: this.hashToken(refreshToken), userId: user.id },
      update: { tokenHash: this.hashToken(refreshToken) },
      where: { userId: user.id },
    });

    return {
      homePath: user.homePath ?? undefined,
      id: user.id,
      realName: user.realName,
      roles: user.roles.map((r) => r.role.code),
      username: user.username,
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken?: string) {
    if (refreshToken) {
      const payload = decodeRefreshToken(refreshToken);
      if (payload?.username) {
        const user = await this.prisma.user.findUnique({
          where: { username: payload.username },
          select: { id: true },
        });
        if (user) {
          await this.prisma.refreshToken.deleteMany({ where: { userId: user.id } });
        }
      }
    }
    return { message: 'ok' };
  }

  async refresh(refreshToken: string) {
    const payload = decodeRefreshToken(refreshToken);

    if (!payload) {
      forbiddenResponse('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { username: payload.username },
      select: {
        homePath: true,
        id: true,
        realName: true,
        roles: { select: { role: { select: { code: true } } } },
        username: true,
      },
    });

    if (!user) {
      forbiddenResponse('User not found');
    }

    const stored = await this.prisma.refreshToken.findUnique({
      where: { userId: user.id },
      select: { tokenHash: true },
    });

    if (!stored || stored.tokenHash !== this.hashToken(refreshToken)) {
      await this.prisma.refreshToken.deleteMany({ where: { userId: user.id } });
      forbiddenResponse('Invalid refresh token');
    }

    const accessToken = generateAccessToken({ username: user.username });
    const newRefreshToken = generateRefreshToken({ username: user.username });
    await this.prisma.refreshToken.upsert({
      create: { tokenHash: this.hashToken(newRefreshToken), userId: user.id },
      update: { tokenHash: this.hashToken(newRefreshToken) },
      where: { userId: user.id },
    });

    return {
      homePath: user.homePath ?? undefined,
      id: user.id,
      realName: user.realName,
      roles: user.roles.map((r) => r.role.code),
      username: user.username,
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private hashPassword(password: string) {
    const salt = env.PASSWORD_SALT;
    if (!salt) {
      if (env.NODE_ENV === 'production') {
        throw new Error('PASSWORD_SALT is required in production');
      }
      return createHash('sha256').update(`dev_password_salt:${password}`).digest('hex');
    }
    return createHash('sha256').update(`${salt}:${password}`).digest('hex');
  }
}
