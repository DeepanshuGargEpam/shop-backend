import { handlerPath } from '@libs/handler-resolver';

export const createProduct =  {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
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
