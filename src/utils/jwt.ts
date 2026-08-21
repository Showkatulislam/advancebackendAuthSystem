import jwt, { Secret } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config.js";
import type { AccessTokenPayload } from "../types/auth.js";

export const generateAccessToken = (
    payload: AccessTokenPayload
): string => {
    return jwt.sign(payload, jwtConfig.access.secret as Secret, {
        expiresIn: jwtConfig.access.expiresIn as any,
    });
};