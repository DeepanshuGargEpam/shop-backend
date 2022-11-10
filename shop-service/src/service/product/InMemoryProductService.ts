import { ProductServiceError, StatusCode } from '../../common';
import mockProducts from '../../mocks/product';
import { AvailableProduct, Product,ProductCreateInput } from '../../models/products';
import { v4 as uuid } from 'uuid';

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

  async create(input: ProductCreateInput): Promise<Product> {
    const product: AvailableProduct = {
      ...input,
      id: uuid(),
    };

    this.data.push(product);

    return product;
  }

  async notify(subject: string, message: string): Promise<unknown> {
    return console.log(subject, message);
  }
}
