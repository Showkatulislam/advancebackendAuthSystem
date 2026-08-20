import { Response } from 'express';

interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string | null | undefined;
  meta?:
    | {
        page?: number | undefined;
        limit?: number | undefined;
        total?: number | undefined;
        [key: string]: any;
      }
    | undefined;
  data?: T | null | undefined;
}

export const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message ?? null,
    meta: data.meta,
    data: data.data ?? null,
  };

  res.status(data.statusCode).json(responseData);
};
