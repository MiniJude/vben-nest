import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(menu: any) {
    const id =
      typeof menu?.id === 'number'
        ? menu.id
        : ((await this.prisma.menu.aggregate({ _max: { id: true } }))?._max?.id ??
            0) + 1;

    const created = await this.prisma.menu.create({
      data: {
        authCode: menu?.authCode ?? null,
        component: menu?.component ?? null,
        icon: menu?.icon ?? null,
        id,
        meta: menu?.meta ?? null,
        name: menu?.name,
        path: menu?.path ?? null,
        pid: typeof menu?.pid === 'number' ? menu.pid : 0,
        status: typeof menu?.status === 'number' ? menu.status : 1,
        type: menu?.type,
      },
    });

    return {
      ...created,
      meta: created.meta ?? undefined,
      pid: created.pid ?? undefined,
      path: created.path ?? undefined,
      component: created.component ?? undefined,
      authCode: created.authCode ?? undefined,
      icon: created.icon ?? undefined,
    };
  }

  async delete(id: number) {
    const menu = await this.prisma.menu.findUnique({ where: { id } });
    if (!menu) {
      return null;
    }
    await this.prisma.menu.delete({ where: { id } });
    return {
      ...menu,
      meta: menu.meta ?? undefined,
      pid: menu.pid ?? undefined,
      path: menu.path ?? undefined,
      component: menu.component ?? undefined,
      authCode: menu.authCode ?? undefined,
      icon: menu.icon ?? undefined,
    };
  }

  async getList() {
    const rows = await this.prisma.menu.findMany({ orderBy: { id: 'asc' } });

    const nodeById = new Map<number, any>();
    for (const row of rows) {
      nodeById.set(row.id, {
        ...row,
        authCode: row.authCode ?? undefined,
        children: [],
        component: row.component ?? undefined,
        icon: row.icon ?? undefined,
        meta: row.meta ?? undefined,
        path: row.path ?? undefined,
        pid: row.pid ?? undefined,
      });
    }

    const roots: any[] = [];
    for (const row of rows) {
      const node = nodeById.get(row.id)!;
      const pid = row.pid ?? 0;
      if (pid && nodeById.has(pid)) {
        nodeById.get(pid)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    const normalize = (nodes: any[]): any[] =>
      nodes.map((n) => {
        const children = normalize(n.children);
        if (children.length === 0) {
          const { children: _children, ...rest } = n;
          return rest;
        }
        return { ...n, children };
      });

    return normalize(roots);
  }

  async nameExists(name: string, id?: string): Promise<boolean> {
    const existing = await this.prisma.menu.findFirst({
      where: {
        id: id ? { not: Number(id) } : undefined,
        name,
      },
      select: { id: true },
    });
    return Boolean(existing);
  }

  async pathExists(path: string, id?: string): Promise<boolean> {
    if (!path) {
      return false;
    }
    const existing = await this.prisma.menu.findFirst({
      where: {
        id: id ? { not: Number(id) } : undefined,
        path,
      },
      select: { id: true },
    });
    return Boolean(existing);
  }

  async update(id: number, menu: any) {
    const existing = await this.prisma.menu.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    const updated = await this.prisma.menu.update({
      data: {
        authCode: menu?.authCode ?? undefined,
        component: menu?.component ?? undefined,
        icon: menu?.icon ?? undefined,
        meta: menu?.meta ?? undefined,
        name: menu?.name ?? undefined,
        path: menu?.path ?? undefined,
        pid: typeof menu?.pid === 'number' ? menu.pid : undefined,
        status: typeof menu?.status === 'number' ? menu.status : undefined,
        type: menu?.type ?? undefined,
      },
      where: { id },
    });
    return {
      ...updated,
      meta: updated.meta ?? undefined,
      pid: updated.pid ?? undefined,
      path: updated.path ?? undefined,
      component: updated.component ?? undefined,
      authCode: updated.authCode ?? undefined,
      icon: updated.icon ?? undefined,
    };
  }
}
