import { Router } from 'express';

import healthCheck from '@components/healthcheck/healthCheck.router';
import user from '@components/user/user.router';
import leave from '@components/leave/leave.router';
import checkIn from '@components/checkIn/checkIn.router';

const router: Router = Router();
router.use(healthCheck);
router.use(user);
router.use(leave);
router.use(checkIn);

export default router;
