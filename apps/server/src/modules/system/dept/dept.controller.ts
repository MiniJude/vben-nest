import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { Public } from '../../../common/decorators/public.decorator';
import { DeptService } from './dept.service';

@Controller('system/dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post()
  @Public()
  async create(@Body() body: any) {
    const result = this.deptService.create(body);
    return result;
  }

  @Delete(':id')
  @Public()
  async delete(@Param('id') id: string) {
    const result = this.deptService.delete(Number(id));
    return result;
  }

  @Get('list')
  @Public()
  async getList() {
    const list = this.deptService.getList();
    return list;
  }

  @Public()
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const result = this.deptService.update(Number(id), body);
    return result;
  }
}
