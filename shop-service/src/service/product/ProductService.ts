import { SNS } from 'aws-sdk';

import { ProductServiceError, StatusCode } from '../../common';
import ProductServices from '../../db/productService';
import { Product } from '../../models/products';

import { Service } from '../types';

class ProductService implements Service<Product> {
//  private readonly db = new dynamo<Product>();
  private readonly ns = new SNS();

  async getAll() {
    try {
      return ProductServices.getProduct();
    } catch (error) {
      throw new ProductServiceError(StatusCode.SERVER_ERROR);
    }
  }

  // NOTE: This is probably not the best way to filter the data
  async getAvailable() {
    const products = await this.getAll();

    return products.filter(product => product.count > 0);
  }

  async getOne(id: string) {
    const product = await ProductServices.getProductById(id);

    if (!product) {
      throw new ProductServiceError(StatusCode.NOT_FOUND_ERROR);
    }

    return product;
  }

//   async create(input: ProductCreateInput) {
//     const ajw = new Ajv({ allErrors: true });
//     const validate = ajw.compile<ProductCreateInput>(schema);

//     if (!validate(input)) {
//       throw new ProductServiceError(StatusCode.BAD_INPUT);
//     }

//     try {
//       return ProductServices.createProduct(input);
//     } catch (error) {
//       throw new ProductServiceError(StatusCode.SERVER_ERROR);
//     }
//   }

  async notify(subject: string, message: string): Promise<SNS.PublishResponse> {
    return this.ns
      .publish({
        Subject: subject,
        Message: message,
        TopicArn: 'arn:aws:sns:us-east-1:648820303910:createProductTopic',
      })
      .promise();
  }
}

const service = new ProductService();
export default service;
