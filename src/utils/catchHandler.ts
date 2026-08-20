import { Request, Response, NextFunction, RequestHandler } from 'express';

// Defines a type for async route handlers
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const catchAsync = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
