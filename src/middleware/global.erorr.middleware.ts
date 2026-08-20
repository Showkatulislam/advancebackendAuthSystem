import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';

export const globalErrorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorSources: Array<{ path: string; message: string }> = [];

  // Check if error comes from your custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  // Final structured HTTP response
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    errorSources: errorSources.length > 0 ? errorSources : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
