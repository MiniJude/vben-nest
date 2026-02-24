import { env } from 'node:process';

import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { MOCK_USERS, UserInfo } from './mock-data';

type SafeUserInfo = Omit<UserInfo, 'password'>;

interface UserTokenPayload {
  username: string;
}

function getAccessTokenSecret(): string {
  const secret = env.JWT_ACCESS_SECRET;
  if (secret) {
    return secret;
  }
  if (env.NODE_ENV === 'production') {
    throw new Error('JWT_ACCESS_SECRET is required in production');
  }
  return 'dev_jwt_access_secret';
}

function getRefreshTokenSecret(): string {
  const secret = env.JWT_REFRESH_SECRET;
  if (secret) {
    return secret;
  }
  if (env.NODE_ENV === 'production') {
    throw new Error('JWT_REFRESH_SECRET is required in production');
  }
  return 'dev_jwt_refresh_secret';
}

function getAccessTokenExpiresIn(): jwt.SignOptions['expiresIn'] {
  return (env.JWT_ACCESS_EXPIRES_IN as any) || '15m';
}

function getRefreshTokenExpiresIn(): jwt.SignOptions['expiresIn'] {
  return (env.JWT_REFRESH_EXPIRES_IN as any) || '7d';
}

function findSafeUser(username: string): null | SafeUserInfo {
  const user = MOCK_USERS.find((item) => item.username === username);
  if (!user) {
    return null;
  }
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function generateAccessToken(user: UserInfo): string {
  const payload: UserTokenPayload = { username: user.username };
  return jwt.sign(payload, getAccessTokenSecret(), {
    expiresIn: getAccessTokenExpiresIn(),
  });
}

export function generateRefreshToken(user: UserInfo): string {
  const payload: UserTokenPayload = { username: user.username };
  return jwt.sign(payload, getRefreshTokenSecret(), {
    expiresIn: getRefreshTokenExpiresIn(),
  });
}

export function verifyAccessToken(req: Request): null | SafeUserInfo {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, getAccessTokenSecret()) as jwt.JwtPayload;
    const username = decoded?.username;
    if (typeof username !== 'string' || !username) {
      return null;
    }
    return findSafeUser(username);
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): null | SafeUserInfo {
  try {
    const decoded = jwt.verify(
      token,
      getRefreshTokenSecret(),
    ) as jwt.JwtPayload;
    const username = decoded?.username;
    if (typeof username !== 'string' || !username) {
      return null;
    }
    return findSafeUser(username);
  } catch {
    return null;
  }
}
