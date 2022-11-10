import { ErrorMessage, StatusCode } from './constants';

export class ExportServiceError extends Error {
  statusCode: StatusCode;

  constructor(statusCode: StatusCode) {
    super(ErrorMessage[statusCode]);

    this.name = 'ExportServiceError';
    this.statusCode = statusCode;
  }
}