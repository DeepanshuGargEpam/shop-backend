import {
    ValidatedEventAPIGatewayProxyEvent,
  } from '@libs/api-gateway';
  import { ProductServiceError } from '../../common';
import {  formatJSONResponse } from '@libs/api-gateway';
  import { middyfy } from '@libs/lambda';
  import ProductService from '../../db/productService';
  import StocksService from '../../db/stockService';
  
  const createProduct: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
    console.log('Create a product with arguments ' + JSON.stringify(event.body));
    try {
      const { title, description, price, count,category,image } = event.body as any;
      const data = {
        title,
        description,
        price,
        category,image
      };
  
      if (!title || !description || !price) {
        return formatJSONResponse({
            error: "Need to fill all fields",
            statusCode:400,
          });
      }
  
      const createdProductId = await ProductService.createProduct(data);
  
      const createdStock = await StocksService.createStock({
        product_id: createdProductId,
        count,
      });
  
      return formatJSONResponse({
        data: {
          ...data,
          id: createdProductId,
          count: createdStock.count,
        },
      });
    } catch (error) {
        const { statusCode, message } = error as ProductServiceError;
    
        return formatJSONResponse({
          error: message,
          statusCode,
        });
      }
  };
  
  export const main = middyfy(createProduct);
  