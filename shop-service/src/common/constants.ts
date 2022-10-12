export enum StatusCode {
    NOT_FOUND_ERROR = 404,
    SERVER_ERROR = 500,
    SUCCESS = 200,
  }
  
  export const ErrorMessage: Record<StatusCode, string | null> = {
    404: 'Product not found.',
    500: 'Server error.',
    200: null,
  };
  