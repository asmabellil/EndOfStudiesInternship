import { Router } from 'express';

import healthCheck from '@components/healthcheck/healthCheck.router';
import user from '@components/user/user.router';
import leave from '@components/leave/leave.router';
import checkIn from '@components/checkIn/checkIn.router';
import pret from '@components/pret/pret.router';

const router: Router = Router();
router.use(healthCheck);
router.use(user);
router.use(leave);
router.use(checkIn);
router.use(pret);

export default router;
