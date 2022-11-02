import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import { StatusCode } from '../common';
type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>


export interface ResponseBody<T> {
  data?: T;
  error?: string;
}

export interface Response<T> extends ResponseBody<T> {
  statusCode?: number;
}
export function formatJSONResponse<T>(response: Response<T>) {
  const { statusCode = StatusCode.SUCCESS, data, error } = response;
  const body = data ?? error;

  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
    body: body ? JSON.stringify(body) : null,
  };
}
