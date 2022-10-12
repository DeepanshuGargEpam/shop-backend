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
import { ProductService } from '../../service/product';

export const getProductListHandler: EventHandler = async () => {
  try {
    const data = await ProductService.getAll();

    return formatJSONResponse({
      data,
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
