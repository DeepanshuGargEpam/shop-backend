// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export const getAllProduct = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'getproducts',
        cors: false,
        responseData: {
          200: {
            description: 'Successful operation',
            bodyType: 'Products',
          },
          500: 'Server error',
        },
      },
    },
  ],
};
