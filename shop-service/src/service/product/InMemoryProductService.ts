import { ProductServiceError, StatusCode } from '../../common';
import mockProducts from '../../mocks/product';
import { Product } from '../../models/products';

import { Service } from '../types';

export class InMemoryProductService implements Service<Product> {
  private readonly data = mockProducts;

  async getAll(): Promise<Product[]> {
    return [...this.data];
  }

//   async getAvailable(): Promise<AvailableProduct[]> {
//     return this.data.filter(item => item.count > 0);
//   }

  async getOne(id: string): Promise<Product> {
    const item = this.data.find(item => item.id === id);

    if (!item) {
      throw new ProductServiceError(StatusCode.NOT_FOUND_ERROR);
    }

    return item;
  }
}
