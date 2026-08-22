import { Request, Response } from 'express';
import { success } from 'zod';

export const getMe = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Authenticated User',
    data: {
      user: req.user,
    },
  });
};
