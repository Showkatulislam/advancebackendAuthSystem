import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchHandler.js';
import { authService } from './auth.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { email } from 'zod';

const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Register successful',
    data: {
      user,
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body.email, req.body.password);
  console.log(result)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data:result
  })
})

export const authController = {
  register,
  login
};
