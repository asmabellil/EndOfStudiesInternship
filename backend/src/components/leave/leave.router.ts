import { Router } from 'express';

import protectedByApiKey from '@core/middlewares/apiKey.middleware';
import validation from '@core/middlewares/validate.middleware';
import * as leaveController from './leave.controller';
import { createLeaveValidation, updateLeaveValidation } from './leave.validation';
// import { checkRole } from '@core/middlewares/checkRole.middleware';

const router: Router = Router();

// e.g. createLeave request's body is validated and protected by api-key
router.post('/leave/', [protectedByApiKey, validation(createLeaveValidation)], leaveController.createLeave);

router.get('/leave/:id', leaveController.readLeave);

router.get('/leaveByUserId/:id', leaveController.readLeavesByUser);

router.get('/leaves', [protectedByApiKey], leaveController.listLeave);

router.put('/leave/:id', [protectedByApiKey, validation(updateLeaveValidation)], leaveController.updateLeave);

router.delete('/leave/:id', [protectedByApiKey], leaveController.deleteLeave);

export default router;
