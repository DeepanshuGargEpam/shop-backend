import { S3 } from 'aws-sdk';
const csv = require('csv-parser');

import {
  BUCKET_NAME,
  PARSED_DIR,
  SIGNED_URL_EXPIRY_SECONDS,
  UPLOADED_DIR,
} from '../config/index';
import { UploadedFile } from '../models/file';

import { Service } from './types';

export class FileService implements Service {
  private readonly s3 = new S3();

  async getSignedUrl(fileName: string): Promise<string> {
    return this.s3.getSignedUrl('putObject', {
      Bucket: BUCKET_NAME,
      Key: `${UPLOADED_DIR}/${fileName}`,
      ContentType: 'text/csv',
      Expires: SIGNED_URL_EXPIRY_SECONDS,
    });
  }

  async importFile(file: UploadedFile): Promise<unknown> {
    const result = await this.s3
      .putObject({
        Bucket: BUCKET_NAME,
        Key: `${UPLOADED_DIR}/${file.name}`,
        Body: file,
      })
      .promise();

    return result.$response.data;
  }

  private async moveParsedFile(key: string) {
    const targetKey = key.replace(UPLOADED_DIR, PARSED_DIR);

    await this.s3
      .copyObject({
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${key}`,
        Key: targetKey,
      })
      .promise();

    await this.s3
      .deleteObject({
        Bucket: BUCKET_NAME,
        Key: key,
      })
      .promise();
  }

  async parseFile<T = unknown>(key: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const parsed = [];
      const stream = this.s3
        .getObject({
          Bucket: BUCKET_NAME,
          Key: key,
        })
        .createReadStream();

      stream
        .pipe(csv())
        .on('data', data => {
          parsed.push(data);
        })
        .on('error', reject)
        .on('end', () => {
          this.moveParsedFile(key)
            .then(() => resolve(parsed))
            .catch(console.error);
        });
    });
  }
}

const service = new FileService();
export default service;
