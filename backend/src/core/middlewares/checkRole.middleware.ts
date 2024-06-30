import Company from '@components/company/company.model';
import AppError from '@core/utils/appError';
import getToken from '@core/utils/getToken';
import logger from '@core/utils/logger';
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';

// Middleware to check user role
const checkRole = (roles: Array<string>) => {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      if (req.user && roles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({ error: 'Insufficient role' });
      }
    } catch (error) {
      logger.error('Insufficient role: ', error.message);
      throw new AppError(httpStatus.FORBIDDEN, 'Insufficient role');
    }
  };
};

const checkRoleUpdate = () => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(403).json({ error: 'Authorization header is missing' });
      }

      const decodedToken = getToken(authHeader);

      const company = await Company.findByPk(req.params.id);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      // eslint-disable-next-line eqeqeq
      if (Number(decodedToken.userId) == company.adminId) {
        return next();
      } else {
        return res.status(403).json({ error: 'Insufficient role' });
      }
    } catch (error) {
      logger.error('Error in checkRoleUpdate middleware: ', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export {checkRole, checkRoleUpdate};
