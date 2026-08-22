import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchHandler.js';
import { authService } from './auth.service.js';
import { sendResponse } from '../../utils/sendResponse.js';

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
  const { email, password } = req.body;
  const userAgent = req.get('user-agent');
  const result = await authService.login(email, password, {
    userAgent,
    ipAddress: req.ip,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful',
    data: result,
  });
});

const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshAccessToken(refreshToken, {
    userAgent: req.get('user-agent'),
    ipAddress: req.ip,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Access token refreshed successfully.',
    data: result,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Logged out successfully.',
    data: null,
  });
});

const logoutAll = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.sub;

  await authService.logoutAll(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Logged out from all devices successfully.',
    data: null,
  });
});

const getActiveSessions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.sub as string;

  const sessions = await authService.getActiveSessions(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Active sessions retrieved successfully.',
    data: sessions,
  });
});

const revokeSession = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.sub;
  const { sessionId } = req.params;
  await authService.revokeSession(sessionId as string, userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Session revoked successfully.',
    data: null,
  });
});

export const authController = {
  register,
  login,
  refreshAccessToken,
  logout,
  getActiveSessions,
  revokeSession,
  logoutAll,
};
