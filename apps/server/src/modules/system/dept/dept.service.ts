import { Injectable } from '@nestjs/common';

import { MenuItem } from '../../../common/utils/mock-data';

@Injectable()
export class DeptService {
  private deptList: MenuItem[] = [
    {
      id: 1,
      name: '总公司',
      pid: 0,
      status: 1,
      type: 'menu',
      meta: { title: '总公司' },
    },
    {
      id: 2,
      name: '技术部',
      pid: 1,
      status: 1,
      type: 'menu',
      meta: { title: '技术部' },
    },
    {
      id: 3,
      name: '市场部',
      pid: 1,
      status: 1,
      type: 'menu',
      meta: { title: '市场部' },
    },
    {
      id: 4,
      name: '前端组',
      pid: 2,
      status: 1,
      type: 'menu',
      meta: { title: '前端组' },
    },
    {
      id: 5,
      name: '后端组',
      pid: 2,
      status: 1,
      type: 'menu',
      meta: { title: '后端组' },
    },
  ];

  create(dept: Omit<MenuItem, 'id'>) {
    const newId = Math.max(...this.deptList.map((d) => d.id)) + 1;
    const newDept = { ...dept, id: newId };
    this.deptList.push(newDept);
    return newDept;
  }

  delete(id: number) {
    const index = this.deptList.findIndex((d) => d.id === id);
    if (index !== -1) {
      const deleted = this.deptList.splice(index, 1)[0];
      return deleted;
    }
    return null;
  }

  getList() {
    return this.deptList;
  }

  update(id: number, dept: Partial<MenuItem>) {
    const index = this.deptList.findIndex((d) => d.id === id);
    if (index !== -1) {
      this.deptList[index] = { ...this.deptList[index], ...dept };
      return this.deptList[index];
    }
    return null;
  }
}
