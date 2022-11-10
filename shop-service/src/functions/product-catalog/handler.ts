import { SQSHandler } from 'aws-lambda';

import { ProductCreateInput } from '../../models/products';
import { ProductService } from '../../service/product';
import ProductServices from '../../db/productService';

enum Message {
  CREATE_SUCCESS = 'A new product is created successfully.',
  NOTIFICATION_SUCCESS = 'The notification was sent successfully.',
  ERROR = 'An error occurred while saving the item.',
}

const catalogBatchProcessHandler: SQSHandler = async event => {
  for (const record of event.Records) {
    const input = JSON.parse(record.body) as ProductCreateInput;

    try {
      const item = await ProductServices.createProduct({
        ...input,
        price: Number(input.price),
        count: Number(input.count),
      });
      console.log(Message.CREATE_SUCCESS, item);

      const notification = await ProductService.notify(
        `New Product - `,
        Message.CREATE_SUCCESS,
      );
      console.log(Message.NOTIFICATION_SUCCESS, notification);
    } catch (error) {
      console.error(Message.ERROR, input.title, error);
    }
  }
};

export const main = catalogBatchProcessHandler;
