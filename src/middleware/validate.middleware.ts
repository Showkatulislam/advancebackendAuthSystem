import { NextFunction, Request, Response } from 'express';
import { success, ZodType } from 'zod';

export const validateRequest = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    console.log(result);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  };
};
