import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class DeptService {
  constructor(private prisma: PrismaService) {}

  async create(dept: any) {
    const created = await this.prisma.dept.create({
      data: {
        meta: dept?.meta ?? null,
        name: dept?.name,
        pid: typeof dept?.pid === 'number' ? dept.pid : 0,
        status: typeof dept?.status === 'number' ? dept.status : 1,
      },
    });
    return {
      ...created,
      meta: created.meta ?? undefined,
      type: 'menu',
    };
  }

  async delete(id: number) {
    const dept = await this.prisma.dept.findUnique({ where: { id } });
    if (!dept) {
      return null;
    }
    await this.prisma.dept.delete({ where: { id } });
    return {
      ...dept,
      meta: dept.meta ?? undefined,
      type: 'menu',
    };
  }

  async getList() {
    const list = await this.prisma.dept.findMany({ orderBy: { id: 'asc' } });
    return list.map((d) => ({
      ...d,
      meta: d.meta ?? undefined,
      type: 'menu',
    }));
  }

  async update(id: number, dept: any) {
    const existing = await this.prisma.dept.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    const updated = await this.prisma.dept.update({
      data: {
        meta: dept?.meta ?? undefined,
        name: dept?.name ?? undefined,
        pid: typeof dept?.pid === 'number' ? dept.pid : undefined,
        status: typeof dept?.status === 'number' ? dept.status : undefined,
      },
      where: { id },
    });
    return {
      ...updated,
      meta: updated.meta ?? undefined,
      type: 'menu',
    };
  }
}
