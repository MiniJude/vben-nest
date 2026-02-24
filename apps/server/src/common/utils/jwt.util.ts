import { Buffer } from 'node:buffer';

import { Request } from 'express';

import { UserInfo } from './mock-data';

interface TokenPayload {
  username: string;
  id: number;
  roles: string[];
}

export function generateAccessToken(user: UserInfo): string {
  const payload: TokenPayload = {
    username: user.username,
    id: user.id,
    roles: user.roles,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function generateRefreshToken(user: UserInfo): string {
  const payload: TokenPayload = {
    username: user.username,
    id: user.id,
    roles: user.roles,
  };
  const data = JSON.stringify(payload);
  return Buffer.from(`${data}:${Date.now()}`).toString('base64');
}

export function verifyAccessToken(req: Request): null | TokenPayload {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.slice(7);
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    return JSON.parse(decoded) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): null | TokenPayload {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const payload = decoded.split(':')[0];
    return JSON.parse(payload) as TokenPayload;
  } catch {
    return null;
  }
}
