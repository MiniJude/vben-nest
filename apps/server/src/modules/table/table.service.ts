import { Injectable } from '@nestjs/common';

import { paginate, sleep } from '../../common/utils/response.util';

export interface TableItem {
  id: string;
  imageUrl: string;
  imageUrl2: string;
  open: boolean;
  status: 'error' | 'success' | 'warning';
  productName: string;
  price: string;
  currency: string;
  quantity: number;
  available: boolean;
  category: string;
  releaseDate: Date;
  rating: number;
  description: string;
  weight: number;
  color: string;
  inProduction: boolean;
  tags: string[];
}

@Injectable()
export class TableService {
  private mockData: TableItem[] = this.generateMockDataList(100);

  async getList(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
  ) {
    await sleep(600);

    const listData = structuredClone(this.mockData);

    if (
      sortBy &&
      listData[0] &&
      Object.prototype.hasOwnProperty.call(listData[0], sortBy)
    ) {
      const isDesc = sortOrder === 'desc';
      listData.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];

        let result = 0;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          result = aValue - bValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          result = aValue.getTime() - bValue.getTime();
        } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          if (aValue === bValue) {
            result = 0;
          } else {
            result = aValue ? 1 : -1;
          }
        } else {
          const aStr = String(aValue);
          const bStr = String(bValue);
          const aNum = Number(aStr);
          const bNum = Number(bStr);
          result =
            Number.isFinite(aNum) && Number.isFinite(bNum)
              ? aNum - bNum
              : aStr.localeCompare(bStr, undefined, {
                  numeric: true,
                  sensitivity: 'base',
                });
        }

        return isDesc ? -result : result;
      });
    }

    const items = paginate(page, pageSize, listData);
    return { items, total: listData.length };
  }

  private generateMockDataList(count: number): TableItem[] {
    const dataList: TableItem[] = [];

    for (let i = 0; i < count; i++) {
      dataList.push({
        id: `item-${i}`,
        imageUrl: `https://i.pravatar.cc/150?img=${i % 70}`,
        imageUrl2: `https://i.pravatar.cc/150?img=${(i + 1) % 70}`,
        open: Math.random() > 0.5,
        status: ['success', 'error', 'warning'][
          Math.floor(Math.random() * 3)
        ] as 'error' | 'success' | 'warning',
        productName: `Product ${i}`,
        price: (Math.random() * 1000).toFixed(2),
        currency: ['USD', 'EUR', 'CNY'][Math.floor(Math.random() * 3)],
        quantity: Math.floor(Math.random() * 100) + 1,
        available: Math.random() > 0.3,
        category: `Category ${Math.floor(Math.random() * 10)}`,
        releaseDate: new Date(Date.now() - Math.random() * 10_000_000_000),
        rating: Math.random() * 5,
        description: `This is product ${i}`,
        weight: Number.parseFloat((Math.random() * 10).toFixed(2)),
        color: ['red', 'blue', 'green', 'yellow', 'black'][
          Math.floor(Math.random() * 5)
        ],
        inProduction: Math.random() > 0.2,
        tags: [`Tag ${i}-1`, `Tag ${i}-2`, `Tag ${i}-3`],
      });
    }

    return dataList;
  }
}
