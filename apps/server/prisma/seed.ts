import { createHash } from 'node:crypto';
import process, { env } from 'node:process';

import { PrismaClient } from '@prisma/client';

import {
  MOCK_CODES,
  MOCK_MENU_LIST,
  MOCK_USERS,
} from '../src/common/utils/mock-data';

function hashPassword(password: string) {
  const salt = env.PASSWORD_SALT || 'dev_password_salt';
  return createHash('sha256').update(`${salt}:${password}`).digest('hex');
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function flattenMenus(menus: any[], pid: number = 0): any[] {
  const rows: any[] = [];
  for (const menu of menus) {
    const children = Array.isArray(menu.children) ? menu.children : [];
    const { children: _children, ...rest } = menu;
    rows.push({
      ...rest,
      authCode: rest.authCode ?? null,
      component: rest.component ?? null,
      icon: rest.icon ?? null,
      meta: rest.meta ?? null,
      path: rest.path ?? null,
      pid: typeof rest.pid === 'number' ? rest.pid : pid,
    });
    if (children.length > 0) {
      rows.push(...flattenMenus(children, menu.id));
    }
  }
  return rows;
}

async function main() {
  const prisma = new PrismaClient();
  await prisma.$connect();

  await prisma.role.upsert({
    create: {
      code: 'super',
      description: '拥有所有权限',
      name: '超级管理员',
      status: 1,
    },
    update: {
      description: '拥有所有权限',
      name: '超级管理员',
      status: 1,
    },
    where: { code: 'super' },
  });

  await prisma.role.upsert({
    create: {
      code: 'admin',
      description: '拥有大部分权限',
      name: '管理员',
      status: 1,
    },
    update: {
      description: '拥有大部分权限',
      name: '管理员',
      status: 1,
    },
    where: { code: 'admin' },
  });

  await prisma.role.upsert({
    create: {
      code: 'user',
      description: '普通用户权限',
      name: '普通用户',
      status: 1,
    },
    update: {
      description: '普通用户权限',
      name: '普通用户',
      status: 1,
    },
    where: { code: 'user' },
  });

  const roleByCode = await prisma.role.findMany({
    select: { code: true, id: true },
  });
  const roleIdByCode = new Map(roleByCode.map((r) => [r.code, r.id]));

  const usersSeed = MOCK_USERS.map((u) => ({
    homePath: u.homePath ?? null,
    password: u.password,
    realName: u.realName,
    roles: u.roles,
    username: u.username,
  }));

  for (const u of usersSeed) {
    await prisma.user.upsert({
      create: {
        homePath: u.homePath,
        passwordHash: hashPassword(u.password),
        realName: u.realName,
        status: 1,
        username: u.username,
      },
      update: {
        homePath: u.homePath,
        passwordHash: hashPassword(u.password),
        realName: u.realName,
        status: 1,
      },
      where: { username: u.username },
    });
  }

  const users = await prisma.user.findMany({
    select: { id: true, username: true },
  });
  const userIdByUsername = new Map(users.map((u) => [u.username, u.id]));

  await prisma.userRole.deleteMany({});
  await prisma.userRole.createMany({
    data: usersSeed.flatMap((u) => {
      const userId = userIdByUsername.get(u.username)!;
      return u.roles.map((code) => ({
        roleId: roleIdByCode.get(code)!,
        userId,
      }));
    }),
    skipDuplicates: true,
  });

  await prisma.userPermissionCode.deleteMany({});
  await prisma.userPermissionCode.createMany({
    data: MOCK_CODES.flatMap((c) => {
      const userId = userIdByUsername.get(c.username)!;
      return c.codes.map((code) => ({ code, userId }));
    }),
    skipDuplicates: true,
  });

  await prisma.refreshToken.deleteMany({});

  const deptSeed = [
    { id: 1, meta: { title: '总公司' }, name: '总公司', pid: 0, status: 1 },
    { id: 2, meta: { title: '技术部' }, name: '技术部', pid: 1, status: 1 },
    { id: 3, meta: { title: '市场部' }, name: '市场部', pid: 1, status: 1 },
    { id: 4, meta: { title: '前端组' }, name: '前端组', pid: 2, status: 1 },
    { id: 5, meta: { title: '后端组' }, name: '后端组', pid: 2, status: 1 },
  ];

  for (const d of deptSeed) {
    await prisma.dept.upsert({
      create: {
        id: d.id,
        meta: d.meta,
        name: d.name,
        pid: d.pid,
        status: d.status,
      },
      update: {
        meta: d.meta,
        name: d.name,
        pid: d.pid,
        status: d.status,
      },
      where: { id: d.id },
    });
  }

  const menuRows = flattenMenus(MOCK_MENU_LIST);
  for (const m of menuRows) {
    await prisma.menu.upsert({
      create: {
        authCode: m.authCode,
        component: m.component,
        icon: m.icon,
        id: m.id,
        meta: m.meta,
        name: m.name,
        path: m.path,
        pid: m.pid ?? 0,
        status: m.status ?? 1,
        type: m.type,
      },
      update: {
        authCode: m.authCode,
        component: m.component,
        icon: m.icon,
        meta: m.meta,
        name: m.name,
        path: m.path,
        pid: m.pid ?? 0,
        status: m.status ?? 1,
        type: m.type,
      },
      where: { id: m.id },
    });
  }

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
});

export { hashPassword, hashToken };
