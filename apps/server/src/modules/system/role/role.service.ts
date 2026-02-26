import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

export interface Role {
  id: number;
  name: string;
  code: string;
  status: number;
  description?: string;
}

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(role: Omit<Role, 'id'>) {
    return await this.prisma.role.create({
      data: {
        code: role.code,
        description: role.description ?? null,
        name: role.name,
        status: role.status,
      },
      select: {
        code: true,
        description: true,
        id: true,
        name: true,
        status: true,
      },
    });
  }

  async delete(id: number) {
    const existing = await this.prisma.role.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    await this.prisma.role.delete({ where: { id } });
    return existing;
  }

  async getList(page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.role.findMany({
        orderBy: { id: 'asc' },
        skip: offset,
        take: pageSize,
      }),
      this.prisma.role.count(),
    ]);
    return {
      items,
      total,
    };
  }

  async update(id: number, role: Partial<Role>) {
    const existing = await this.prisma.role.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    return await this.prisma.role.update({
      data: {
        code: role.code ?? undefined,
        description: role.description ?? undefined,
        name: role.name ?? undefined,
        status: role.status ?? undefined,
      },
      where: { id },
    });
  }
}
