// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { formatJSONResponse,EventHandler } from '@libs/api-gateway';
// import { middyfy } from '@libs/lambda';

// import schema from './schema';

// const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
//   return formatJSONResponse({
//     message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
//     event,
//   });
// };

// export const main = middyfy(hello);

import { ProductServiceError } from '../../common';
import { EventHandler, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductService from '../../db/productService';
import StocksService from '../../db/stockService';
// import { ProductService } from '../../service/product';

export const getProductListHandler: EventHandler = async () => {
  console.log('Get all cars');
  try {
    const data = await ProductService.getProduct();
    console.log("data",data)

    const stocks = await StocksService.getStocks();
    console.log("stock",stocks)

    const response = [];

    data.forEach((car) => {
      const foundStock = stocks.find((stock) => stock.product_id === car.id);
      console.log("foundsock",foundStock)
      response.push({ ...car, count: foundStock.count });
    });
    return formatJSONResponse({
      data:response,
    });
  } catch (error) {
    const { statusCode, message } = error as ProductServiceError;

    return formatJSONResponse({
      error: message,
      statusCode,
    });
  }
};

export const main = middyfy(getProductListHandler);
