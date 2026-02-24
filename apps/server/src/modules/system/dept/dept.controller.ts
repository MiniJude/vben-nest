import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { DeptService } from './dept.service';

@Controller('system/dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post()
  async create(@Body() body: any) {
    const result = this.deptService.create(body);
    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = this.deptService.delete(Number(id));
    return result;
  }

  @Get('list')
  async getList() {
    const list = this.deptService.getList();
    return list;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const result = this.deptService.update(Number(id), body);
    return result;
  }
}
