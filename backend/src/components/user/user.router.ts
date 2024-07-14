import { Router } from 'express';

import protectedByApiKey from '@core/middlewares/apiKey.middleware';
import validation from '@core/middlewares/validate.middleware';
import * as userController from './user.controller';
import { createUserValidation, updateUserValidation } from './createUser.validation';
// import { checkRole } from '@core/middlewares/checkRole.middleware';

const router: Router = Router();

// e.g. createUser request's body is validated and protected by api-key
router.post('/user/', [protectedByApiKey, validation(createUserValidation)], userController.createUser);

router.get('/user/:id', userController.readUser);

router.get('/users', [protectedByApiKey], userController.listUser);

router.put('/user/:id', [protectedByApiKey, validation(updateUserValidation)], userController.updateUser);

router.delete('/user/:id', [protectedByApiKey], userController.deleteUser);

export default router;
