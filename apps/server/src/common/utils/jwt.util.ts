import { env } from 'node:process';

import { Request } from 'express';
import jwt from 'jsonwebtoken';

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

export function generateAccessToken(payload: UserTokenPayload): string {
  return jwt.sign(payload, getAccessTokenSecret(), {
    expiresIn: getAccessTokenExpiresIn(),
  });
}

export function generateRefreshToken(payload: UserTokenPayload): string {
  return jwt.sign(payload, getRefreshTokenSecret(), {
    expiresIn: getRefreshTokenExpiresIn(),
  });
}

export function decodeAccessToken(req: Request): null | UserTokenPayload {
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
    return { username };
  } catch {
    return null;
  }
}

export function decodeRefreshToken(token: string): null | UserTokenPayload {
  try {
    const decoded = jwt.verify(
      token,
      getRefreshTokenSecret(),
    ) as jwt.JwtPayload;
    const username = decoded?.username;
    if (typeof username !== 'string' || !username) {
      return null;
    }
    return { username };
  } catch {
    return null;
  }
}
