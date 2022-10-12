import { ProductServiceError } from '../../common';
import {
  EventHandlerWithPathParameters,
  formatJSONResponse,
} from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { ProductService } from '../../service/product';

import schema from './schema';

export const getProductByIdHandler: EventHandlerWithPathParameters<
  typeof schema
> = async event => {
  try {
    console.log("checking",event.pathParameters)
    if(event.pathParameters===undefined){

    return formatJSONResponse({
      error: "Product Not Found",
      statusCode:404,
    });
    }
    const { id } = event.pathParameters;
    const data = await ProductService.getOne(id);

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

export const main = middyfy(getProductByIdHandler);
