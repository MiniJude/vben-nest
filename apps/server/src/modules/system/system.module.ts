import { Module } from '@nestjs/common';

import { DeptModule } from './dept/dept.module';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [DeptModule, MenuModule, RoleModule],
})
export class SystemModule {}
