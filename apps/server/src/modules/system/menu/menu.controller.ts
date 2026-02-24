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

import { MenuService } from './menu.service';

@Controller('system/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async create(@Body() body: any) {
    const result = this.menuService.create(body);
    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = this.menuService.delete(Number(id));
    return result;
  }

  @Get('list')
  async getList() {
    const list = this.menuService.getList();
    return list;
  }

  @Get('name-exists')
  async nameExists(@Query('name') name: string, @Query('id') id?: string) {
    const exists = this.menuService.nameExists(name, id);
    return exists;
  }

  @Get('path-exists')
  async pathExists(@Query('path') path: string, @Query('id') id?: string) {
    const exists = this.menuService.pathExists(path, id);
    return exists;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const result = this.menuService.update(Number(id), body);
    return result;
  }
}
