import { Router } from 'express';

import protectedByApiKey from '@core/middlewares/apiKey.middleware';
import validation from '@core/middlewares/validate.middleware';
import * as pretController from './pret.controller';
import { createPretValidation, updatePretValidation } from './pret.validation';
// import { checkRole } from '@core/middlewares/checkRole.middleware';

const router: Router = Router();

// e.g. createPret request's body is validated and protected by api-key
router.post('/pret/', [protectedByApiKey, validation(createPretValidation)], pretController.createPret);

router.get('/pret/:id', pretController.readPret);

router.get('/prets', [protectedByApiKey], pretController.listPret);

router.get('/prets/:userId', [protectedByApiKey], pretController.getListPretByUserId);

router.put('/pret/:id', [protectedByApiKey, validation(updatePretValidation)], pretController.updatePret);

router.delete('/pret/:id', [protectedByApiKey], pretController.deletePret);

router.get('/echances', [protectedByApiKey], pretController.getListEchances);

router.get('/echances/:userId', [protectedByApiKey], pretController.getListEchancesByUserId);

router.get('/generatePretPDF/:pretId', [protectedByApiKey], pretController.generatePretPDF);

export default router;
