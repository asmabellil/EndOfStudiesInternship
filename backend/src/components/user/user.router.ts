import { Router } from 'express';

import protectedByApiKey from '@core/middlewares/apiKey.middleware';
import validation from '@core/middlewares/validate.middleware';
import * as userController from './user.controller';
import { createUserValidation, validatePaginationParams, changePasswordValidation, udateUserValidation, createTechnicianValidation, updateTechnicianValidation } from './createUser.validation';
import consts from '@config/consts';
// import { checkRole } from '@core/middlewares/checkRole.middleware';

const router: Router = Router();

const adminRole = [consts.ROLE.COMPANY_ADMIN];

// e.g. createUser request's body is validated and protected by api-key
router.post('/user/', [protectedByApiKey, validation(createUserValidation)], userController.createUser);

router.get('/user/', userController.readUser);

router.get('/users', [protectedByApiKey, validatePaginationParams], userController.listUser);

router.put('/user', [protectedByApiKey, validation(udateUserValidation)], userController.updateUser);

router.delete('/user/:id', [protectedByApiKey], userController.deleteUser);

router.put('/user/changePassword/', [protectedByApiKey, validation(changePasswordValidation)], userController.changePassword);

router.get('/technicians/', [protectedByApiKey, validatePaginationParams,/*  checkRole(adminRole) */], userController.getTechnicians);

router.post('/technician/', [protectedByApiKey, validation(createTechnicianValidation)/* , checkRole(adminRole) */], userController.createTechnician);

router.put('/technician/:id', [protectedByApiKey, validation(updateTechnicianValidation)/* , checkRole(adminRole) */], userController.updateTechnician);

router.delete('/technician/:id', [protectedByApiKey/* , checkRole(adminRole) */], userController.deleteTechnician);

export default router;
