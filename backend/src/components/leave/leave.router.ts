import { Router } from 'express';

import protectedByApiKey from '@core/middlewares/apiKey.middleware';
import validation from '@core/middlewares/validate.middleware';
import * as userController from './user.controller';
import { createUserValidation, validatePaginationParams, changePasswordValidation } from './createUser.validation';
// import { checkRole } from '@core/middlewares/checkRole.middleware';

const router: Router = Router();

// e.g. createUser request's body is validated and protected by api-key
router.post('/user/', [protectedByApiKey, validation(createUserValidation)], userController.createUser);

router.get('/user/:id', userController.readUser);

router.get('/users', [protectedByApiKey, validatePaginationParams], userController.listUser);

router.put('/user/:id', [protectedByApiKey], userController.updateUser);

router.delete('/user/:id', [protectedByApiKey], userController.deleteUser);

router.put('/user/changePassword/', [protectedByApiKey, validation(changePasswordValidation)], userController.changePassword);

export default router;
