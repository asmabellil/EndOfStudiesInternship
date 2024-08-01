import { Router } from 'express';

import protectedByApiKey from '@core/middlewares/apiKey.middleware';
import validation from '@core/middlewares/validate.middleware';
import * as checkInController from './checkIn.controller';
import { createCheckInValidation, updateCheckInValidation } from './checkIn.validation';
// import { checkRole } from '@core/middlewares/checkRole.middleware';

const router: Router = Router();

// e.g. createCheckIn request's body is validated and protected by api-key
router.post('/checkIn/', [protectedByApiKey, validation(createCheckInValidation)], checkInController.createCheckIn);

router.get('/checkIn/:id', checkInController.readCheckIn);

router.get('/checkInByUserId/:id', checkInController.readCheckInsByUser);

router.get('/checkIns', [protectedByApiKey], checkInController.listCheckIn);

router.put('/checkIn/:id', [protectedByApiKey, validation(updateCheckInValidation)], checkInController.updateCheckIn);

router.delete('/checkIn/:id', [protectedByApiKey], checkInController.deleteCheckIn);

export default router;
