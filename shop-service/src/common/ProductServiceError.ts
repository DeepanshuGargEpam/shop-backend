import { ErrorMessage, StatusCode } from './constants';

export class ProductServiceError extends Error {
  statusCode: StatusCode;

  constructor(statusCode: StatusCode) {
    super(ErrorMessage[statusCode]);

    this.name = 'ProductServiceError';
    this.statusCode = statusCode;
  }
}