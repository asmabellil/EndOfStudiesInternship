import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import config from '@config/config';
import AppError from '@core/utils/appError';
import logger from '@core/utils/logger';

const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const secretKey = config.jwtSecret;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length).trim();

    try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, secretKey);

      // Optionally, attach the decoded information to the request
      // so that it can be used in your route handlers
      req.user = decoded;

      return next();
    } catch (error) {
      logger.error('Invalid token: ', error.message);
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }
  } else {
    logger.error('Missing bearer token in request header');
    throw new AppError(httpStatus.UNAUTHORIZED, 'Missing token');
  }
};

export default verifyToken;
