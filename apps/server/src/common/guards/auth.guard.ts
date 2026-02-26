import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { decodeAccessToken } from '../utils/jwt.util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const payload = decodeAccessToken(request);

    if (!payload) {
      throw new UnauthorizedException('Unauthorized Exception');
    }

    const user = await this.prisma.user.findUnique({
      where: { username: payload.username },
      select: {
        id: true,
        homePath: true,
        realName: true,
        username: true,
        roles: { select: { role: { select: { code: true } } } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized Exception');
    }

    request.user = {
      id: user.id,
      homePath: user.homePath ?? undefined,
      realName: user.realName,
      roles: user.roles.map((r) => r.role.code),
      username: user.username,
    };
    return true;
  }
}
