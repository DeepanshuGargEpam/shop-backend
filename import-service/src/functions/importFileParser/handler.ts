// import {
//     ValidatedEventAPIGatewayProxyEvent,
//   } from '@libs/api-gateway';
//   import middy from '@middy/core';
//   import {  formatJSONResponse } from '@libs/api-gateway';
//   import { ExportServiceError } from '../../common';
//   const csv = require('csv-parser');
//   import * as AWS from 'aws-sdk';
//   const BUCKET = 'image-uploaded';
  
//   const readFile = async (s3, params) => {
//     const s3Stream = s3.getObject(params).createReadStream();
//     await s3Stream
//       .pipe(csv())
//       .on('data', (chunk) => {
//         console.log('data: ', chunk);
//       })
//       .on('error', (error) => {
//         console.log(error);
//       })
//       .on('end', () => {
//         console.log('end');
//       });
//   };
//   const importFileParser: ValidatedEventAPIGatewayProxyEvent<void> = async (
//     event: any
//   ) => {
//     console.log('start importFileParser: ');
  
//     console.log('Start parsing: ', event);
//     const s3 = new AWS.S3({ region: 'us-east-1' });
//     console.log('Lambda importFileParser is invoked! Event: ', event);
  
//     try {
//       const csvKey = event.Records[0].s3.object.key;
//       const [, fileName] = csvKey.split('/');
//       const newPrefix = 'parsed';
  
//       const params = { Bucket: BUCKET, Key: csvKey };
//       const paramsToWrite = {
//         Bucket: BUCKET,
//         CopySource: `${BUCKET}/${csvKey}`,
//         Key: `${newPrefix}/${fileName}`,
//       };
  
//       await readFile(s3, params);
  
//       await s3.copyObject(paramsToWrite).promise();
  
//       await s3.deleteObject(params).promise();
//     } catch (error) {
//         const { statusCode, message } = error as ExportServiceError;
    
//         return formatJSONResponse({
//           error: message,
//           statusCode,
//         });
//     }
//   };
  
//   export const main = middy(importFileParser);




import { Context } from 'aws-lambda';
import { SQS } from 'aws-sdk';

import type { EventHandler } from '../../libs/api-gateway';
import { FileService } from '../../services';

interface ProductInput {
  title: string;
}

enum Message {
  QUEUE_SUCCESS = 'The SQS message is sent successfully.',
  PARSE_ERROR = 'The file could not be parsed.',
  ERROR = 'An error occurred while sending the SQS message.',
}

const getQueueUrl = (context: Context) => {
  const region = context.invokedFunctionArn.split(':')[3];
  const accountId = context.invokedFunctionArn.split(':')[4];
  const queueName = 'catalogItemsQueue';

  return `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;
};

const parseFileHandler: EventHandler = async (event, context) => {
  let parsed: ProductInput[] = [];

  try {
    const key = event.Records[0].s3.object.key;
    parsed = await FileService.parseFile<ProductInput>(key);
  } catch (error) {
    console.error(Message.PARSE_ERROR, error);
  }

  if (!parsed.length) return;

  const sqs = new SQS();
  const queueUrl = getQueueUrl(context);

  for (const item of parsed) {
    try {
      const result = await sqs
        .sendMessage({
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(item),
        })
        .promise();

      console.log(Message.QUEUE_SUCCESS, item.title, result);
    } catch (error) {
      console.error(Message.ERROR, item.title, error);
    }
  }
};

export const main = parseFileHandler;
