import {
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {  formatJSONResponse } from '@libs/api-gateway';
import schema from './schema';
import { ExportServiceError } from '../../common';
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'us-east-1' });

const BUCKET = 'image-uploaded';


const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { name } = event.queryStringParameters;
  console.log('importProductsFile is invoked: ' + name);

  try {
    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv',
    };

    const url = await s3.getSignedUrl('putObject', params);

    console.log("url",url)

    // return {
      return formatJSONResponse({
        data:url,
      });
      // statusCode: 200,
      // headers: {
      //   'Access-Control-Allow-Headers': '*',
      //   'Access-Control-Allow-Methods': '*',
      //   'Access-Control-Allow-Origin': '*',
      // },
      // body: url,
    // };
  } catch (error) {
    const { statusCode, message } = error as ExportServiceError;
    
        return formatJSONResponse({
          error: message,
          statusCode,
        });
  }
};

export const main = middyfy(importProductsFile);