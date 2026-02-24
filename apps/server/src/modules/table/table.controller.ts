import { Controller, Get, Query } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator';
import { paginatedResponse } from '../../common/utils/response.util';
import { TableService } from './table.service';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get('list')
  @Public()
  async getList(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSizeNumber = Math.min(
      100,
      Math.max(1, Number.parseInt(pageSize, 10) || 10),
    );
    const result = await this.tableService.getList(
      pageNumber,
      pageSizeNumber,
      sortBy,
      sortOrder,
    );
    return paginatedResponse(result.items, result.total);
  }
}
