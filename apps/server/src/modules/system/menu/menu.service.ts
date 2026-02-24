import { Injectable } from '@nestjs/common';

import { MenuItem, MOCK_MENU_LIST } from '../../../common/utils/mock-data';

@Injectable()
export class MenuService {
  private menuList: MenuItem[] = JSON.parse(JSON.stringify(MOCK_MENU_LIST));
  private namesMap: Record<string, string> = {};
  private pathMap: Record<string, string> = { '/': '0' };

  constructor() {
    this.buildMaps();
  }

  create(menu: Omit<MenuItem, 'id'>) {
    const newId = Math.max(...this.getMenuIds(this.menuList)) + 1;
    const newMenu = { ...menu, id: newId };
    this.menuList.push(newMenu);
    this.buildMaps();
    return newMenu;
  }

  delete(id: number) {
    const index = this.menuList.findIndex((m) => m.id === id);
    if (index !== -1) {
      const deleted = this.menuList.splice(index, 1)[0];
      this.buildMaps();
      return deleted;
    }
    return null;
  }

  getList() {
    return this.menuList;
  }

  nameExists(name: string, id?: string): boolean {
    return name in this.namesMap && (!id || this.namesMap[name] !== String(id));
  }

  pathExists(path: string, id?: string): boolean {
    return path in this.pathMap && (!id || this.pathMap[path] !== String(id));
  }

  update(id: number, menu: Partial<MenuItem>) {
    const index = this.menuList.findIndex((m) => m.id === id);
    if (index !== -1) {
      this.menuList[index] = { ...this.menuList[index], ...menu };
      this.buildMaps();
      return this.menuList[index];
    }
    return null;
  }

  private buildMaps() {
    this.namesMap = {};
    this.pathMap = { '/': '0' };
    this.buildNameMap(this.menuList);
    this.buildPathMap(this.menuList);
  }

  private buildNameMap(menus: MenuItem[]) {
    menus.forEach((menu) => {
      this.namesMap[menu.name] = String(menu.id);
      if (menu.children && menu.children.length > 0) {
        this.buildNameMap(menu.children);
      }
    });
  }

  private buildPathMap(menus: MenuItem[]) {
    menus.forEach((menu) => {
      this.pathMap[menu.path] = String(menu.id);
      if (menu.children && menu.children.length > 0) {
        this.buildPathMap(menu.children);
      }
    });
  }

  private getMenuIds(menus: MenuItem[]): number[] {
    const ids: number[] = [];
    menus.forEach((item) => {
      ids.push(item.id);
      if (item.children && item.children.length > 0) {
        ids.push(...this.getMenuIds(item.children));
      }
    });
    return ids;
  }
}
