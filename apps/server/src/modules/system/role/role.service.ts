import { Injectable } from '@nestjs/common';

export interface Role {
  id: number;
  name: string;
  code: string;
  status: number;
  description?: string;
}

@Injectable()
export class RoleService {
  private roleList: Role[] = [
    {
      id: 1,
      name: '超级管理员',
      code: 'super',
      status: 1,
      description: '拥有所有权限',
    },
    {
      id: 2,
      name: '管理员',
      code: 'admin',
      status: 1,
      description: '拥有大部分权限',
    },
    {
      id: 3,
      name: '普通用户',
      code: 'user',
      status: 1,
      description: '普通用户权限',
    },
  ];

  create(role: Omit<Role, 'id'>) {
    const newId = Math.max(...this.roleList.map((r) => r.id)) + 1;
    const newRole = { ...role, id: newId };
    this.roleList.push(newRole);
    return newRole;
  }

  delete(id: number) {
    const index = this.roleList.findIndex((r) => r.id === id);
    if (index !== -1) {
      const deleted = this.roleList.splice(index, 1)[0];
      return deleted;
    }
    return null;
  }

  getList(page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize;
    const items =
      offset + pageSize >= this.roleList.length
        ? this.roleList.slice(offset)
        : this.roleList.slice(offset, offset + pageSize);
    return {
      items,
      total: this.roleList.length,
    };
  }

  update(id: number, role: Partial<Role>) {
    const index = this.roleList.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.roleList[index] = { ...this.roleList[index], ...role };
      return this.roleList[index];
    }
    return null;
  }
}
