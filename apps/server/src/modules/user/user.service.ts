import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getInfo(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        homePath: true,
        id: true,
        realName: true,
        roles: { select: { role: { select: { code: true } } } },
        username: true,
      },
    });
    if (!user) {
      return undefined;
    }
    return {
      homePath: user.homePath ?? undefined,
      id: user.id,
      realName: user.realName,
      roles: user.roles.map((r) => r.role.code),
      username: user.username,
    };
  }
}
