import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Public } from '../../../common/decorators/public.decorator';
import { Role, RoleService } from './role.service';

@Controller('system/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Public()
  async create(@Body() body: Omit<Role, 'id'>) {
    const result = this.roleService.create(body);
    return result;
  }

  @Delete(':id')
  @Public()
  async delete(@Param('id') id: string) {
    const result = this.roleService.delete(Number(id));
    return result;
  }

  @Get('list')
  @Public()
  async getList(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20',
  ) {
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 20;
    const result = this.roleService.getList(pageNum, pageSizeNum);
    return result;
  }

  @Public()
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Role>) {
    const result = this.roleService.update(Number(id), body);
    return result;
  }
}
